import { ForbiddenError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class PositionAPI extends dbUtils.KnexDataSource {
  getPosition(identifier: gql.PositionFilter): Promise<gql.Maybe<gql.Position>> {
    return dbUtils.unique(this.getPositions(identifier));
  }

  getPositions(filter?: gql.PositionFilter): Promise<gql.Position[]> {
    return this.knex<sql.DbPosition>('positions').select('*').where(filter || {})
  }

  createPosition(context: context.UserContext | undefined, input: sql.DbCreatePosition) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('positions').insert(input).returning('id');
  }

  updatePosition(context: context.UserContext | undefined, id: number, input: sql.DbUpdatePosition) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    if (Object.keys(input).length === 0) return new Promise(resolve => resolve(false));
    return this.knex('positions').where({id}).update(input)
  }

  removePosition(context: context.UserContext | undefined, id: number) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('positions').where({id}).del()
  }
}
