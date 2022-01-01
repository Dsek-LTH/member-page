import { UserInputError } from 'apollo-server';
import {
  dbUtils, context, UUID, meilisearch,
} from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export async function addMemberToSearchIndex(member: sql.Member) {
  if (process.env.NODE_ENV !== 'test') {
    const index = meilisearch.index('members');
    await index.addDocuments([{
      id: member.id,
      student_id: member.student_id,
      first_name: member.first_name,
      nick_name: member.nickname,
      last_name: member.last_name,
    }]);
  }
}

export default class MemberAPI extends dbUtils.KnexDataSource {
  getMemberFromKeycloakId(keycloak_id: string): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.Member>('members')
      .select('members.*')
      .join('keycloak', { 'members.id': 'keycloak.member_id' })
      .where({ keycloak_id }));
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
    identifier: { student_id?: string, id?: UUID },
  ): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:read', ctx, async () => dbUtils.unique(this.knex<sql.Member>('members').select('*').where({ visible: true, ...identifier })));
  }

  createMember(ctx: context.UserContext, input: gql.CreateMember): Promise<gql.Maybe<gql.Member>> {
    return this.withAccess('core:member:create', ctx, async () => {
      const keycloakId = ctx.user?.keycloak_id;
      if (!keycloakId) return undefined;
      const keycloakExists = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: keycloakId }));
      if (keycloakExists) return undefined;

      const userExists = await dbUtils.unique(this.knex<sql.Member>('members').where({ student_id: ctx.user?.student_id }));
      if (userExists) {
        await this.knex<sql.Keycloak>('keycloak').insert({ keycloak_id: keycloakId, member_id: userExists.id });
        addMemberToSearchIndex(userExists);
        return userExists;
      }
      const member = (await this.knex<sql.Member>('members').insert(input).returning('*'))[0];
      await this.knex<sql.Keycloak>('keycloak').insert({ keycloak_id: keycloakId, member_id: member.id });
      addMemberToSearchIndex(member);
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
    });
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
