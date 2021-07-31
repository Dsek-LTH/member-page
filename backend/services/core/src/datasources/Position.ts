import { ForbiddenError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export default class PositionAPI extends dbUtils.KnexDataSource {
  getPosition(identifier: gql.PositionFilter): Promise<gql.Maybe<gql.Position>> {
    return dbUtils.unique(this.knex<sql.Position>('positions').select('*').where(identifier));
  }

  async getPositions(page: number, perPage: number, filter?: gql.PositionFilter): Promise<gql.PositionPagination> {
    const filtered = this.knex<sql.Position>('positions').where(filter || {});
    const positions = await filtered
      .clone()
      .offset(page * perPage)
      .limit(perPage);

    const totalPositions = (await filtered.clone().count({ count: '*' }))[0].count || 0;
    const pageInfo = dbUtils.createPageInfo(<number>totalPositions, page, perPage)
    return {
      positions: positions,
      pageInfo: pageInfo,
    }
  }

  createPosition(context: context.UserContext | undefined, input: sql.CreatePosition) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('positions').insert(input).returning('id');
  }

  updatePosition(context: context.UserContext | undefined, id: number, input: sql.UpdatePosition) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    if (Object.keys(input).length === 0) return new Promise(resolve => resolve(false));
    return this.knex('positions').where({id}).update(input)
  }

  removePosition(context: context.UserContext | undefined, id: number) {
    if (!context?.user) throw new ForbiddenError('Operation denied');
    return this.knex('positions').where({id}).del()
  }
}
