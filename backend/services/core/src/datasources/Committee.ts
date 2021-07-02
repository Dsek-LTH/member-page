import { ForbiddenError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class CommitteeAPI extends dbUtils.KnexDataSource {
  getCommittee(identifier: gql.CommitteeFilter): Promise<gql.Maybe<gql.Committee>> {
    return dbUtils.unique(this.knex<sql.DbCommittee>('committees').select('*').where(identifier));
  }

  getCommitteeFromPositionId(position_id: gql.Scalars['Int']): Promise<gql.Maybe<gql.Committee>> {
    return dbUtils.unique(
      this.knex<sql.DbCommittee>('positions')
      .select('committees.*')
      .join('committees', {'positions.committee_id': 'committees.id'})
      .where({'positions.id': position_id})
    );
  }

  async getCommittees(page: number, perPage: number, filter?: gql.CommitteeFilter): Promise<gql.CommitteePagination> {
    const committees = await this.knex<sql.DbCommittee>('committees')
      .select('*')
      .where(filter || {})
      .offset(page * perPage)
      .limit(perPage);

    const totalCommittees = (await this.knex<sql.DbCommittee>('committees').select('*').where(filter || {})).length
    const totalPages = Math.ceil(totalCommittees/perPage);

    const pageInfo = {
      totalPages: totalPages,
      totalItems: totalCommittees,
      page: page,
      perPage: perPage,
      hasNextPage: page + 1 < totalPages,
      hasPreviousPage: page > 0,
    }

    return {
      committees: committees,
      pageInfo: pageInfo,
    }
  }

  createCommittee(context: context.UserContext | undefined, input: sql.DbCreateCommittee) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('committees').insert(input)
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
