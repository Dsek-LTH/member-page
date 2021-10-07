import { ForbiddenError, UserInputError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';

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

  async getPosition(identifier: gql.PositionFilter): Promise<gql.Maybe<gql.Position>> {
    const position = await dbUtils.unique(this.knex<sql.Position>('positions').select('*').where(identifier));
    if(!position) {
      return undefined;
    }
    return this.convertPosition(position);
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
      positions: positions.map(p => this.convertPosition(p)),
      pageInfo: pageInfo,
    }
  }

  async createPosition(context: context.UserContext | undefined, input: sql.CreatePosition): Promise<gql.Maybe<gql.Position>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    const res = (await this.knex('positions').insert(input).returning('*'))[0];

    await kcClient.createPosition(res.id, false);

    return this.convertPosition(res);
  }

  async updatePosition(context: context.UserContext | undefined, id: string, input: sql.UpdatePosition): Promise<gql.Maybe<gql.Position>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    const res = (await this.knex<sql.Position>('positions').select('*').where({id}).update(input).returning('*'))[0];

    if (!res)
      throw new UserInputError('id did not exist');

    return this.convertPosition(res);
  }

  async removePosition(context: context.UserContext | undefined, id: string): Promise<gql.Maybe<gql.Position>> {
    if (!context?.user) throw new ForbiddenError('Operation denied');

    const res = (await this.knex<sql.Position>('positions').select('*').where({id}))[0]

    if (!res)
      throw new UserInputError('position did not exist');

    await this.knex('positions').where({id}).del();

    await kcClient.deletePosition(id);

    return this.convertPosition(res);
  }
}
