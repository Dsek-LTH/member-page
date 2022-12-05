import { UserInputError } from 'apollo-server';
import {
  dbUtils, context, UUID,
} from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import meilisearchAdmin from '../shared/meilisearch';

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
        members,
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
      return query.first();
    });
  }

  createMember(ctx: context.UserContext, input: gql.CreateMember): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:create', ctx, async () => {
      const keycloakId = ctx.user?.keycloak_id;
      if (!keycloakId) return undefined;
      const keycloakExists = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: keycloakId }));
      if (keycloakExists) return undefined;

      const existingUser = await dbUtils.unique(this.knex<sql.Member>('members').where({ student_id: ctx.user?.student_id }));
      if (existingUser) {
        await this.knex<sql.Keycloak>('keycloak').insert({ keycloak_id: keycloakId, member_id: existingUser.id });
        meilisearchAdmin.addMemberToSearchIndex(existingUser);
        return existingUser;
      }
      // else
      const member = (await this.knex<sql.Member>('members').insert(input).returning('*'))[0];
      await this.knex<sql.Keycloak>('keycloak').insert({ keycloak_id: keycloakId, member_id: member.id });
      meilisearchAdmin.addMemberToSearchIndex(member);
      return member;
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
      return member;
    }, id);
  }

  removeMember(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:delete', ctx, async () => {
      const member = await dbUtils.unique(this.knex<sql.Member>('members').where({ id }));
      if (!member) throw new UserInputError('id did not exist');
      await this.knex<sql.Member>('members').where({ id }).del();
      return member;
    });
  }
}
