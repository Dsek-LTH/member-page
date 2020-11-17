import { ForbiddenError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class PositionAPI extends dbUtils.KnexDataSource {
  getAllPositions(): Promise<gql.Position[]> {
    return this.knex<sql.DbPosition>('positions').select('*');
  }

  getPosition(identifier: gql.PositionFilter): Promise<gql.Maybe<gql.Position>> {
    return dbUtils.unique(this.getPositions(identifier));
  }

  getPositions(filter: gql.PositionFilter): Promise<gql.Position[]> {
    return this.knex<sql.DbPosition>('positions').select('*').where(filter)
  }

  createPosition({user}: context.UserContext, input: sql.DbCreatePosition) {
    if (!user) throw new ForbiddenError('Operation denied');
    return this.knex('positions').insert(input);
  }

  async updatePosition({user}: context.UserContext, id: number, input: sql.DbUpdatePosition) {
    if (!user) throw new ForbiddenError('Operation denied');
    if (Object.keys(input).length === 0) return false;
    return this.knex('positions').where({id}).update(input)
  }

  removePosition({user}: context.UserContext, id: number) {
    if (!user) throw new ForbiddenError('Operation denied');
    return this.knex('positions').where({id}).del()
  }
}
