import { UserInputError } from 'apollo-server';
import type { DataSources } from '~/src/datasources';
import { context, dbUtils, UUID } from '../shared';
import meilisearchAdmin from '../shared/meilisearch';
import * as sql from '../types/database';
import * as gql from '../types/graphql';
import { NotificationType } from '../shared/notifications';

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
      const result = await this.knex<sql.Member>('members').where({ id }).update(input).returning('*');
      if (!result.length) throw new UserInputError('id did not exist');
      return convertMember(result[0], ctx);
    }, id);
  }

  updateFoodPreference(
    ctx: context.UserContext,
    id: UUID,
    foodPreference: string,
  ): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:update', ctx, async () => {
      const result = await this.knex<sql.Member>('members').where({ id }).update({ food_preference: foodPreference }).returning('*');
      if (!result.length) throw new UserInputError('id did not exist');
      return convertMember(result[0], ctx);
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
      const currentMember = await this.getMember(ctx, { student_id: ctx.user?.student_id });
      if (!currentMember) return [];
      /**
       * The below query is a bit complicated, so here's a breakdown:
       * 1. Get all pings where the current member is the sender or receiver,
       *    and the last ping was from the other user
       * 2. Join the members table to get the other member's info
       * 3. Filter out the current user from the members join
       *    (as it will return 2 both members in the ping convo)
       * 4. Order by the last ping time, to get newest pings first
       */
      const unansweredPings = await this.knex
        .select('count', 'members.*', this.knex.raw('GREATEST(??, ??) as last_ping', ['to_sent_at', 'from_sent_at']))
        .from('pings')
        .where((knex) =>
          knex.where((k) =>
            k.where('pings.from_member', '=', currentMember.id)
              .andWhere('to_sent_at', '>', this.knex.raw('from_sent_at')))
            .orWhere((k) =>
              k.where('pings.to_member', '=', currentMember.id)
                .andWhere(this.knex.raw('?? > COALESCE(??, ?)', ['from_sent_at', 'to_sent_at', 'epoch']))))
        .join('members', (knex) => {
          knex.on('members.id', '=', 'pings.from_member')
            .orOn('members.id', '=', 'pings.to_member');
        })
        .where('members.id', '<>', currentMember.id)
        .orderBy('last_ping', 'desc');

      const mappedPings: gql.Ping[] = unansweredPings.map(({ count, last_ping, ...member }) => ({
        counter: Math.ceil(Number.parseInt(count, 10) / 2),
        lastPing: last_ping,
        from: convertMember(member, ctx),
      }));
      return mappedPings;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private isTooRecent = (date: Date) =>
    date > (new Date(Date.now() - 3_000)); // 3 seconds between pings

  private checkPingRequirement = async (ctx: context.UserContext, memberId: UUID):
  Promise<{ pingHistory?: sql.Ping, currentMember: gql.Member }> => {
    if (!this.hasAccess('core:member:ping', ctx)) throw new UserInputError('You do not have access');
    const currentMember = await this.getMember(ctx, { student_id: ctx.user?.student_id });
    if (!currentMember) throw new UserInputError('Current member not found');
    try {
      const memberExists = await dbUtils.unique(this.knex<sql.Member>('members').where({ id: memberId }));
      if (!memberExists) throw new UserInputError('Member not found');
    } catch (e) {
      throw new UserInputError('Member not found');
    }
    if (currentMember.id === memberId) throw new UserInputError('You cannot ping yourself');

    // Get the ping history between the two users
    const pingHistory = await this.knex<sql.Ping>('pings')
      .where((knex) =>
        knex.where('from_member', currentMember.id).andWhere('to_member', memberId))
      .orWhere((knex) => knex.where('from_member', memberId).andWhere('to_member', currentMember.id))
      .first();

    // If there's no ping history or if the other user sent the most recent ping,
    // then the current user is allowed to ping the other user.
    if (!pingHistory) return { currentMember };

    if (pingHistory.from_member === memberId) {
      // If they're the next to send
      if (pingHistory.from_sent_at <= (pingHistory.to_sent_at ?? new Date(0))) {
        throw new UserInputError('Cannot send ping before other user responds');
      }
      // If the user's last ping was too recent
      if (pingHistory.to_sent_at !== null
        && this.isTooRecent(pingHistory.to_sent_at)) {
        throw new UserInputError('You have to wait to ping this user again');
      }

      return { pingHistory, currentMember };
    }

    if (pingHistory.to_member === memberId) {
      // If they're the next to send
      if ((pingHistory.to_sent_at ?? new Date(0)) <= pingHistory.from_sent_at) {
        throw new UserInputError('Cannot send ping before other user responds');
      }
      // If the user's last ping was too recent
      if (this.isTooRecent(pingHistory.from_sent_at)) throw new UserInputError('You have to wait to ping this user again');

      return { pingHistory, currentMember };
    }

    throw new UserInputError('memberId did not match pingHistory');
  };

  async canPing(ctx: context.UserContext, memberId: UUID): Promise<boolean> {
    try {
      await this.checkPingRequirement(ctx, memberId);
      return true;
    } catch (e) {
      return false;
    }
  }

  async pingMember(ctx: context.UserContext, memberId: UUID): Promise<void> {
    // checkPingRequirement also checks access
    const { pingHistory, currentMember } = await this.checkPingRequirement(ctx, memberId);

    if (!pingHistory) {
      await this.knex('pings')
        .insert({
          from_member: currentMember.id,
          to_member: memberId,
        });
    } else if (pingHistory.from_member === memberId) {
      await this.knex('pings').where({ id: pingHistory.id }).update({
        to_sent_at: this.knex.fn.now(),
        count: this.knex.raw('?? + 1', ['count']),
      });
    } else {
      await this.knex('pings').where({ id: pingHistory.id }).update({
        from_sent_at: this.knex.fn.now(),
        count: this.knex.raw('?? + 1', ['count']),
      });
    }
    this.addNotification({
      title: `${currentMember.first_name} ${currentMember.last_name} har pingat dig!`,
      message: '',
      link: '/pings',
      memberIds: [memberId],
      type: NotificationType.PING,
      fromMemberId: currentMember.id,
    });
  }
}
