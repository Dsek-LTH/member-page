import { dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';


export default class MemberAPI extends dbUtils.KnexDataSource {
  getMember(identifier: {student_id?: string, id?: number}): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.DbMember>('members').select('*').where(identifier));
  }
}