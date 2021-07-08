import { UserInputError } from 'apollo-server';
import { dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';


export default class MemberAPI extends dbUtils.KnexDataSource {

  async getMembers(page: number, perPage: number, filter?: gql.MemberFilter): Promise<gql.MemberPagination> {
    const members =  await this.knex<sql.DbMember>('members')
      .select('*')
      .where(filter || {})
      .offset(page * perPage)
      .orderBy("last_name", "asc")
      .limit(perPage);

    const totalMembers = (await this.knex<sql.DbMember>('members').select('*').where(filter || {})).length
    const pageInfo = dbUtils.createPageInfo(totalMembers, page, perPage)

    return {
      members: members,
      pageInfo: pageInfo,
    }
  }

  getMemberFromKeycloakId(keycloak_id: string): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.DbMember>('members')
      .select('members.*')
      .join('keycloak', {'members.id': 'keycloak.member_id'})
      .where({keycloak_id: keycloak_id}));
  }

  getMember(identifier: {student_id?: string, id?: number}): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.DbMember>('members').select('*').where(identifier));
  }

  async createMember(input: gql.CreateMember): Promise<gql.Maybe<gql.Member>> {
    const id = (await this.knex<sql.DbMember>('members').insert(input))[0];
    const member = { id, ...input, }
    return member;
  }

  async updateMember(id: number, input: gql.UpdateMember): Promise<gql.Maybe<gql.Member>> {
    await this.knex('members').where({id}).update(input);
    const member = await dbUtils.unique(this.knex<sql.DbMember>('members').where({id}));
    if (!member) throw new UserInputError('id did not exist');
    return member;
  }

  async removeMember(id: number): Promise<gql.Maybe<gql.Member>> {
    const member = await dbUtils.unique(this.knex<sql.DbMember>('members').where({id}));
    if (!member) throw new UserInputError('id did not exist');
    await this.knex<sql.DbMember>('members').where({id}).del();
    return member;
  }
}