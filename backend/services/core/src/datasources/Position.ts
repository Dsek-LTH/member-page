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

  getPosition = (context: context.UserContext, identifier: gql.PositionFilter): Promise<gql.Maybe<gql.Position>> =>
    this.withAccess('core:position:read', context, async () => {
      const position = await dbUtils.unique(this.knex<sql.Position>('positions').select('*').where(identifier));
      if (!position) {
        return undefined;
      }
      return this.convertPosition(position);
    });

  getPositions = (context: context.UserContext, page: number, perPage: number, filter?: gql.PositionFilter): Promise<gql.PositionPagination> =>
    this.withAccess('core:position:read', context, async () => {
      const filtered = this.knex<sql.Position>('positions').where(filter || {});
      const positions = await filtered
        .clone()
        .offset(page * perPage)
        .limit(perPage);

      const totalPositions = parseInt((await filtered.clone().count({ count: '*' }))[0].count?.toString() || "0");
      const pageInfo = dbUtils.createPageInfo(<number>totalPositions, page, perPage)
      return {
        positions: positions.map(p => this.convertPosition(p)),
        pageInfo: pageInfo,
      }
    });

  createPosition = (context: context.UserContext, input: gql.CreatePosition): Promise<gql.Maybe<gql.Position>> =>
    this.withAccess('core:position:create', context, async () => {
      const res = (await this.knex('positions').insert(input).returning('*'))[0];

      const success = await kcClient.createPosition(res.id, false);

      if (!success) {
        await this.knex('positions').where({ id: res.id }).del();
        throw Error('Failed to find group in Keycloak');
      }

      return this.convertPosition(res);
    });

  updatePosition = (context: context.UserContext, id: string, input: sql.UpdatePosition): Promise<gql.Maybe<gql.Position>> =>
    this.withAccess('core:position:update', context, async () => {
      const res = (await this.knex<sql.Position>('positions').select('*').where({ id }).update(input).returning('*'))[0];

      if (!res)
        throw new UserInputError('id did not exist');

      return this.convertPosition(res);
    });

  removePosition = (context: context.UserContext, id: string): Promise<gql.Maybe<gql.Position>> =>
    this.withAccess('core:position:delete', context, async () => {
      const res = (await this.knex<sql.Position>('positions').select('*').where({ id }))[0]

      if (!res)
        throw new UserInputError('position did not exist');

      await this.knex('positions').where({ id }).del();

      return this.convertPosition(res);
    });
}
