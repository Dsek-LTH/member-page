import { ForbiddenError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class CommitteeAPI extends dbUtils.KnexDataSource {
  getAllCommittees(): Promise<gql.Committee[]> {
    return this.knex<sql.DbCommittee>('committees').select('*');
  }

  getCommittee(identifier: gql.CommitteeFilter): Promise<gql.Maybe<gql.Committee>> {
    return dbUtils.unique(this.getCommittees(identifier));
  }

  getCommitteeFromPositionId(position_id: gql.Scalars['Int']): Promise<gql.Maybe<gql.Committee>> {
    return dbUtils.unique(
      this.knex<sql.DbCommittee>('positions')
      .select('committees.*')
      .join('committees', {'positions.committee_id': 'committees.id'})
      .where({'positions.id': position_id})
    );
  }

  getCommittees(filter: gql.CommitteeFilter): Promise<gql.Committee[]> {
    return this.knex<sql.DbCommittee>('committees').select('*').where(filter)
  }

  createCommittee({user}: context.UserContext, input: sql.DbCreateCommittee) {
    if (!user) throw new ForbiddenError('Operation denied');
    return this.knex('committees').insert(input)
  }

  async updateCommittee({user}: context.UserContext, id: number, input: sql.DbUpdateCommittee) {
    if (!user) throw new ForbiddenError('Operation denied');
    if (Object.keys(input).length === 0) return false;
    return this.knex('committee').where({id}).update(input)
  }

  removeCommittee({user}: context.UserContext, id: number) {
    if (!user) throw new ForbiddenError('Operation denied');
    return this.knex('committee').where({id}).del()
  }
}
