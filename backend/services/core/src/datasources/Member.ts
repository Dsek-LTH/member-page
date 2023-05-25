import { UserInputError } from 'apollo-server';
import type { DataSources } from '~/src/datasources';
import { context, dbUtils, UUID } from '../shared';
import meilisearchAdmin from '../shared/meilisearch';
import * as sql from '../types/database';
import * as gql from '../types/graphql';

export const convertMember = <T extends gql.Maybe<gql.Member> | gql.Member>
  (member: T, ctx: context.UserContext): T => {
  if (ctx.user) {
    return member;
  }
  return {
    ...member,
    nickname: null,
  };
};

export default class MemberAPI extends dbUtils.KnexDataSource {
  getKeycloakIdsFromMemberIds(member_ids: string[]): Promise<gql.Maybe<{ keycloak_id: string }[]>> {
    return this.knex<sql.Member>('keycloak')
      .select('keycloak_id')
      .whereIn('member_id', member_ids);
  }

  getMembers(
    ctx: context.UserContext,
    page: number,
    perPage: number,
    filter?: gql.MemberFilter,
  ): Promise<gql.MemberPagination> {
    return this.withAccess('core:member:read', ctx, async () => {
      let queryFilter: Partial<sql.Member> = filter || {};
      queryFilter = { visible: true, ...queryFilter };

      const filtered = this.knex<sql.Member>('members').where(queryFilter);

      const members = await filtered
        .clone()
        .offset(page * perPage)
        .orderBy('last_name', 'asc')
        .limit(perPage);

      const totalMembers = parseInt((await filtered.clone().count({ count: '*' }))[0].count?.toString() || '0', 10);
      const pageInfo = dbUtils.createPageInfo(<number>totalMembers, page, perPage);

      return {
        members: members.map((member) => convertMember(member, ctx)),
        pageInfo,
      };
    });
  }

  getMember(
    ctx: context.UserContext,
    { student_id, id }: { student_id?: string, id?: UUID },
  ): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:read', ctx, async () => {
      const query = this.knex<sql.Member>('members').select('*').where({ visible: true });
      if (!student_id && !id) return undefined;
      if (id) query.andWhere({ id });
      else if (student_id) query.andWhere({ student_id });
      return convertMember(await query.first(), ctx);
    });
  }

  createMember(
    ctx: context.UserContext,
    input: gql.CreateMember,
    datasources: DataSources,
  ): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:create', ctx, async () => {
      const keycloakId = ctx.user?.keycloak_id;
      if (!keycloakId) return undefined;
      const keycloakExists = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: keycloakId }));
      if (keycloakExists) return undefined;

      const existingUser = await dbUtils.unique(this.knex<sql.Member>('members').where({ student_id: ctx.user?.student_id }));
      if (existingUser) {
        await this.knex<sql.Keycloak>('keycloak').insert({ keycloak_id: keycloakId, member_id: existingUser.id });
        meilisearchAdmin.addMemberToSearchIndex(existingUser);
        await datasources.notificationsAPI.addDefaultSettings(existingUser.id);
        return existingUser;
      }
      // else
      const member = (await this.knex<sql.Member>('members').insert(input).returning('*'))[0];
      await this.knex<sql.Keycloak>('keycloak').insert({ keycloak_id: keycloakId, member_id: member.id });
      meilisearchAdmin.addMemberToSearchIndex(member);
      await datasources.notificationsAPI.addDefaultSettings(member.id);
      return convertMember(member, ctx);
    });
  }

  updateMember(
    ctx: context.UserContext,
    id: UUID,
    input: gql.UpdateMember,
  ): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:update', ctx, async () => {
      await this.knex('members').where({ id }).update(input);
      const member = await dbUtils.unique(this.knex<sql.Member>('members').where({ id }));
      if (!member) throw new UserInputError('id did not exist');
      return convertMember(member, ctx);
    }, id);
  }

  removeMember(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:delete', ctx, async () => {
      const member = await dbUtils.unique(this.knex<sql.Member>('members').where({ id }));
      if (!member) throw new UserInputError('id did not exist');
      await this.knex<sql.Member>('members').where({ id }).del();
      return convertMember(member, ctx);
    });
  }

  getPings(ctx: context.UserContext): Promise<gql.Ping[]> {
    return this.withAccess('core:member:ping', ctx, async () => {
      /**
       * Below is quite a complicated knex sql query. What it does is the following:
       * 1. First, we identify the member (user) based on their student_id. This is done within the
       *    'member' Common Table Expression (CTE).
       * 2. Then, in the 'pings_received' CTE, we select all the 'pings' where the member is the
       *    recipient. We also calculate the count of these pings and the timestamp of the most
       *    recentping from each sender.
       * 3. In the 'pings_sent' CTE, we select all the 'pings' where the member is the sender and we
       *    record the timestamp of the most recent ping to each recipient.
       * 4. We then join these CTEs together, joining 'pings_received' with 'pings_sent' on the
       *    sender's ID, and also joining with the 'members' table to get additional information
       *    about the senders of the pings.
       * 5. In our WHERE condition, we filter out the pings that have been answered (where there is
       *    a more recent ping from the recipient to the sender). This is done using the WHERE NULL
       *    clause for 'pings_sent' and an OR condition to check if the 'pings_received' is more
       *    recent than the 'pings_sent'.
       * 6. Finally, we order the results by the timestamp of the most recent ping from each sender
       *    in descending order.
       * The purpose of this query is to fetch all unanswered 'pings' for a given member, excluding
       *    those pings that have been answered by a more recent ping from the member to the sender.
       */

      const query = this.knex.with(
        'member',
        (knex) => {
          knex.select('id').from('members').where({ student_id: ctx.user?.student_id });
        },
      )
        .with(
          'pings_received',
          (knex) => {
            knex.select('p.from_member')
              .count('* as count')
              .max('p.created_at as last_ping')
              .from('pings as p')
              .innerJoin('member as m', 'm.id', '=', 'p.to_member')
              .groupByRaw('p.from_member');
          },
        )
        .with(
          'pings_sent',
          (knex) => {
            knex.select('p.to_member')
              .max('p.created_at as last_ping')
              .from('pings as p')
              .innerJoin('member as m', 'm.id', '=', 'p.from_member')
              .groupByRaw('p.to_member');
          },
        )
        .select('members.*', 'pr.count', 'pr.last_ping')
        .from('pings_received as pr')
        .leftOuterJoin('pings_sent as ps', 'pr.from_member', '=', 'ps.to_member')
        .innerJoin('members', 'members.id', '=', 'pr.from_member')
        .whereNull('ps.last_ping')
        // We cannot use .orWhere('pr.last_ping', '>', 'ps.last_ping') because: In knex, when you
        // provide a string value as the third parameter to a .orWhere function, it's interpreted
        // as a literal string, not as a column reference.
        .orWhere(this.knex.raw('?? > ??', ['pr.last_ping', 'ps.last_ping']))
        .orderByRaw('pr.last_ping DESC');

      const pings: any[] = await query;
      const mappedPings: gql.Ping[] = pings.map(({ count, last_ping, ...member }) => ({
        counter: Number.parseInt(count, 10),
        lastPing: last_ping,
        from: convertMember(member, ctx),
      }));
      return mappedPings;
    });
  }

  pingMember(ctx: context.UserContext, memberId: UUID): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
