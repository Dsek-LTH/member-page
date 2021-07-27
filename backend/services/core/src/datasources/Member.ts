import { UserInputError } from 'apollo-server';
import { dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';


export default class MemberAPI extends dbUtils.KnexDataSource {

  getMembers(filter?: gql.MemberFilter): Promise<gql.Member[]> {
    return this.knex<sql.Member>('members').select('*').where(filter || {});
  }

  getMemberFromKeycloakId(keycloak_id: string): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.Member>('members')
      .select('members.*')
      .join('keycloak', {'members.id': 'keycloak.member_id'})
      .where({keycloak_id: keycloak_id}));
  }

  getMember(identifier: {student_id?: string, id?: number}): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.Member>('members').select('*').where(identifier));
  }

  async createMember(input: gql.CreateMember): Promise<gql.Maybe<gql.Member>> {
    const id = (await this.knex<sql.Member>('members').insert(input).returning('id'))[0];
    const member = { id, ...input, }
    return member;
  }

  async updateMember(id: number, input: gql.UpdateMember): Promise<gql.Maybe<gql.Member>> {
    await this.knex('members').where({id}).update(input);
    const member = await dbUtils.unique(this.knex<sql.Member>('members').where({id}));
    if (!member) throw new UserInputError('id did not exist');
    return member;
  }

  async removeMember(id: number): Promise<gql.Maybe<gql.Member>> {
    const member = await dbUtils.unique(this.knex<sql.Member>('members').where({id}));
    if (!member) throw new UserInputError('id did not exist');
    await this.knex<sql.Member>('members').where({id}).del();
    return member;
  }
}