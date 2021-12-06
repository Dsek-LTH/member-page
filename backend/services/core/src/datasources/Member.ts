import { UserInputError } from 'apollo-server';
import { dbUtils, context, UUID, meilisearch } from 'dsek-shared';
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
      last_name: member.last_name
    }]);
  }
}


export default class MemberAPI extends dbUtils.KnexDataSource {

  getMemberFromKeycloakId(keycloak_id: string): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.Member>('members')
      .select('members.*')
      .join('keycloak', { 'members.id': 'keycloak.member_id' })
      .where({ keycloak_id: keycloak_id }));
  }

  getMembers = (context: context.UserContext, page: number, perPage: number, filter?: gql.MemberFilter): Promise<gql.MemberPagination> =>
    this.withAccess('core:member:read', context, async () => {

      let queryFilter: Partial<sql.Member> = filter || {};
      queryFilter = { visible: true, ...queryFilter };


      const filtered = this.knex<sql.Member>('members').where(queryFilter);

      const members = await filtered
        .clone()
        .offset(page * perPage)
        .orderBy("last_name", "asc")
        .limit(perPage);

      const totalMembers = parseInt((await filtered.clone().count({ count: '*' }))[0].count?.toString() || "0");
      const pageInfo = dbUtils.createPageInfo(<number>totalMembers, page, perPage)

      return {
        members: members,
        pageInfo: pageInfo,
      }
    });

  getMember = (context: context.UserContext, identifier: { student_id?: string, id?: UUID }): Promise<gql.Maybe<gql.Member>> =>
    this.withAccess('core:member:read', context, async () => {
      return dbUtils.unique(this.knex<sql.Member>('members').select('*').where({ visible: true, ...identifier }));
    });

  createMember = (context: context.UserContext, input: gql.CreateMember): Promise<gql.Maybe<gql.Member>> =>
    this.withAccess('core:member:create', context, async () => {
      const keycloakId = context.user?.keycloak_id;
      if (!keycloakId) return undefined;
      const keycloakExists = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: keycloakId }));
      if (keycloakExists) return undefined;

      const userExists = await dbUtils.unique(this.knex<sql.Member>('members').where({ student_id: context.user?.student_id }));
      if (userExists) {
        await this.knex<sql.Keycloak>('keycloak').insert({ keycloak_id: keycloakId, member_id: userExists.id });
        addMemberToSearchIndex(userExists);
        return userExists;
      } else {
        const member = (await this.knex<sql.Member>('members').insert(input).returning('*'))[0];
        await this.knex<sql.Keycloak>('keycloak').insert({ keycloak_id: keycloakId, member_id: member.id });
        addMemberToSearchIndex(member);
        return member;
      }
    });

  updateMember = (context: context.UserContext, id: UUID, input: gql.UpdateMember): Promise<gql.Maybe<gql.Member>> =>
    this.withAccess('core:member:update', context, async () => {
      await this.knex('members').where({ id }).update(input);
      const member = await dbUtils.unique(this.knex<sql.Member>('members').where({ id }));
      if (!member) throw new UserInputError('id did not exist');
      return member;
    });

  removeMember = (context: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Member>> =>
    this.withAccess('core:member:delete', context, async () => {
      const member = await dbUtils.unique(this.knex<sql.Member>('members').where({ id }));
      if (!member) throw new UserInputError('id did not exist');
      await this.knex<sql.Member>('members').where({ id }).del();
      return member;
    });
}