import { ForbiddenError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class PositionAPI extends dbUtils.KnexDataSource {
  getPosition(identifier: gql.PositionFilter): Promise<gql.Maybe<gql.Position>> {
    return dbUtils.unique(this.knex<sql.DbPosition>('positions').select('*').where(identifier));
  }

  async getPositions(page: number, perPage: number, filter?: gql.PositionFilter): Promise<gql.PositionPagination> {
    const positions = await this.knex<sql.DbPosition>('positions')
      .select('*')
      .where(filter || {})
      .offset(page * perPage)
      .limit(perPage);

    const totalPositions = (await this.knex<sql.DbPosition>('positions').select('*').where(filter || {})).length
    const totalPages = Math.ceil(totalPositions/perPage);

    const pageInfo = {
      totalPages: totalPages,
      totalItems: totalPositions,
      page: page,
      perPage: perPage,
      hasNextPage: page + 1 < totalPages,
      hasPreviousPage: page > 0,
    }

    return {
      positions: positions,
      pageInfo: pageInfo,
    }
  }

  createPosition(context: context.UserContext | undefined, input: sql.DbCreatePosition) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('positions').insert(input);
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
