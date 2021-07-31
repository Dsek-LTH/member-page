import { ForbiddenError, UserInputError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export default class CommitteeAPI extends dbUtils.KnexDataSource {
  getCommittee(identifier: gql.CommitteeFilter): Promise<gql.Maybe<gql.Committee>> {
    return dbUtils.unique(this.getCommittees(identifier));
  }

  getCommitteeFromPositionId(position_id: gql.Scalars['Int']): Promise<gql.Maybe<gql.Committee>> {
    return dbUtils.unique(
      this.knex<sql.Committee>('positions')
      .select('committees.*')
      .join('committees', {'positions.committee_id': 'committees.id'})
      .where({'positions.id': position_id})
    );
  }

  getCommittees(filter?: gql.CommitteeFilter): Promise<gql.Committee[]> {
    return this.knex<sql.Committee>('committees').select('*').where(filter || {})
  }

  async createCommittee(context: context.UserContext | undefined, input: sql.CreateCommittee): Promise<gql.Maybe<gql.Committee>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    const id = (await this.knex('committees').insert(input).returning('id'))[0];
    const res = (await this.knex<sql.Committee>('committees').where({id}))[0];

    return res;
  }

  async updateCommittee(context: context.UserContext | undefined, id: number, input: sql.UpdateCommittee): Promise<gql.Maybe<gql.Committee>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    await this.knex<sql.Committee>('committees').select('*').where({id}).update(input);
    const res = (await this.knex<sql.Committee>('committees').select('*').where({id}))[0];

    if (!res)
      throw new UserInputError('id did not exist');

    return res;
  }

  async removeCommittee(context: context.UserContext | undefined, id: number): Promise<gql.Maybe<gql.Committee>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    const res = (await this.knex<sql.Committee>('committees').select('*').where({id}))[0]

    if (!res)
      throw new UserInputError('mandate did not exist');

    await this.knex('committees').where({id}).del();
    return res;
  }
}
