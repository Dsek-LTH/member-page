import { ForbiddenError, UserInputError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export default class PositionAPI extends dbUtils.KnexDataSource {
  private convertPosition(position: sql.Position): gql.Position {
    const { committee_id, ...rest } = position;
    if (committee_id) {
      const p: gql.Position = {
        committee: { id: committee_id },
        ...rest,
      }
      return p;
    }
    return {
      ...rest,
    }
  }

  getPosition(identifier: gql.PositionFilter): Promise<gql.Maybe<gql.Position>> {
    return dbUtils.unique(this.getPositions(identifier));
  }

  async getPositions(filter?: gql.PositionFilter): Promise<gql.Position[]> {
    const res = this.knex<sql.Position>('positions').select('*').where(filter || {});
    return (await res).map(p => this.convertPosition(p));
  }

  async createPosition(context: context.UserContext | undefined, input: sql.CreatePosition): Promise<gql.Maybe<gql.Position>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    const id = (await this.knex('positions').insert(input).returning('id'))[0];
    const res = (await this.knex<sql.Position>('positions').where({id}))[0];

    return this.convertPosition(res);
  }

  async updatePosition(context: context.UserContext | undefined, id: number, input: sql.UpdatePosition): Promise<gql.Maybe<gql.Position>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    await this.knex<sql.Position>('positions').select('*').where({id}).update(input);
    const res = (await this.knex<sql.Position>('positions').select('*').where({id}))[0];

    if (!res)
      throw new UserInputError('id did not exist');

    return this.convertPosition(res);
    }

  async removePosition(context: context.UserContext | undefined, id: number): Promise<gql.Maybe<gql.Position>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    const res = (await this.knex<sql.Position>('positions').select('*').where({id}))[0]

    if (!res)
      throw new UserInputError('position did not exist');

    await this.knex('positions').where({id}).del();
    return this.convertPosition(res);
  }
}
