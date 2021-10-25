import { UserInputError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';


export default class MemberAPI extends dbUtils.KnexDataSource {

  getMemberFromKeycloakId(keycloak_id: string): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.Member>('members')
      .select('members.*')
      .join('keycloak', { 'members.id': 'keycloak.member_id' })
      .where({ keycloak_id: keycloak_id }));
  }

  getMembers = (context: context.UserContext, page: number, perPage: number, filter?: gql.MemberFilter): Promise<gql.MemberPagination> =>
    this.withAccess('core:member:read', context, async () => {
      const filtered = this.knex<sql.Member>('members').where(filter || {});

      const members = await filtered
        .clone()
        .offset(page * perPage)
        .orderBy("last_name", "asc")
        .limit(perPage);

      const totalMembers = (await filtered.clone().count({ count: '*' }))[0].count || 0;
      const pageInfo = dbUtils.createPageInfo(<number>totalMembers, page, perPage)

      return {
        members: members,
        pageInfo: pageInfo,
      }
    });

  getMember = (context: context.UserContext, identifier: { student_id?: string, id?: number }): Promise<gql.Maybe<gql.Member>> =>
    this.withAccess('core:member:read', context, async () => {
      return dbUtils.unique(this.knex<sql.Member>('members').select('*').where(identifier));
    });

  createMember = (context: context.UserContext, input: gql.CreateMember): Promise<gql.Maybe<gql.Member>> =>
    this.withAccess('core:member:create', context, async () => {
      const id = (await this.knex<sql.Member>('members').insert(input).returning('id'))[0];
      const member = { id, ...input, }
      return member;
    });

  updateMember = (context: context.UserContext, id: number, input: gql.UpdateMember): Promise<gql.Maybe<gql.Member>> =>
    this.withAccess('core:member:update', context, async () => {
      await this.knex('members').where({ id }).update(input);
      const member = await dbUtils.unique(this.knex<sql.Member>('members').where({ id }));
      if (!member) throw new UserInputError('id did not exist');
      return member;
    });

  removeMember = (context: context.UserContext, id: number): Promise<gql.Maybe<gql.Member>> =>
    this.withAccess('core:member:delete', context, async () => {
      const member = await dbUtils.unique(this.knex<sql.Member>('members').where({ id }));
      if (!member) throw new UserInputError('id did not exist');
      await this.knex<sql.Member>('members').where({ id }).del();
      return member;
    });
}