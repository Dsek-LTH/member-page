import { dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';


export default class MemberAPI extends dbUtils.KnexDataSource {

  getMembers(filter?: gql.MemberFilter): Promise<gql.Member[]> {
    return this.knex<sql.DbMember>('members').select('*').where(filter || {});
  }

  getMemberFromKeycloakId(keycloak_id: string): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.DbMember>('members')
      .select('members.*')
      .join('keycloak', {'members.id': 'keycloak.member_id'})
      .where({keycloak_id: keycloak_id})
      .first());
  }

  getMember(identifier: {student_id?: string, id?: number}): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.DbMember>('members').select('*').where(identifier));
  }
}