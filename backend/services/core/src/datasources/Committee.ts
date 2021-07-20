import { ForbiddenError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class CommitteeAPI extends dbUtils.KnexDataSource {
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

  getCommittees(filter?: gql.CommitteeFilter): Promise<gql.Committee[]> {
    return this.knex<sql.DbCommittee>('committees').select('*').where(filter || {})
  }

  createCommittee(context: context.UserContext | undefined, input: sql.DbCreateCommittee) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('committees').insert(input).returning('id')
  }

  updateCommittee(context: context.UserContext | undefined, id: number, input: sql.DbUpdateCommittee) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    if (Object.keys(input).length === 0) return new Promise(resolve => resolve(false));
    return this.knex('committee').where({id}).update(input)
  }

  removeCommittee(context: context.UserContext | undefined, id: number) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('committee').where({id}).del()
  }
}
