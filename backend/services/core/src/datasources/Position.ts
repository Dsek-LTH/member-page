import { UserInputError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';

export const convertPosition = (position: sql.Position): gql.Position => {
  const {
    committee_id, name_en, board_member, email, ...rest
  } = position;
  let p: gql.Position = {
    boardMember: board_member,
    email: email ?? undefined,
    ...rest,
  };
  if (committee_id) {
    p = {
      committee: { id: committee_id },
      ...p,
    };
  }
  if (name_en) {
    p = {
      nameEn: name_en,
      ...p,
    };
  }
  return p;
};

export default class PositionAPI extends dbUtils.KnexDataSource {
  getPosition(
    ctx: context.UserContext,
    identifier: gql.PositionFilter,
  ): Promise<gql.Maybe<gql.Position>> {
    return this.withAccess('core:position:read', ctx, async () => {
      const position = await dbUtils.unique(this.knex<sql.Position>('positions').select('*').where(identifier));
      if (!position) {
        return undefined;
      }

      if (!position.active) {
        await this.withAccess('core:position:inactive:read', ctx, async () => { });
      }

      return convertPosition(position);
    });
  }

  getPositions(
    ctx: context.UserContext,
    page: number,
    perPage: number,
    filter?: gql.PositionFilter,
  ): Promise<gql.PositionPagination> {
    return this.withAccess('core:position:read', ctx, async () => {
      let queryFilter: Partial<sql.Position> = filter || {};

      if (queryFilter.active === false) {
        await this.withAccess('core:position:inactive:read', ctx, async () => { });
      } else {
        queryFilter = { active: true, ...queryFilter };
      }

      const filtered = this.knex<sql.Position>('positions').where(queryFilter);

      const positions = await filtered
        .clone()
        .offset(page * perPage)
        .limit(perPage);

      const totalPositions = parseInt((await filtered.clone().count({ count: '*' }))[0].count?.toString() || '0', 10);
      const pageInfo = dbUtils.createPageInfo(<number>totalPositions, page, perPage);
      return {
        positions: positions.map((p) => convertPosition(p)),
        pageInfo,
      };
    });
  }

  createPosition(
    ctx: context.UserContext,
    input: gql.CreatePosition,
  ): Promise<gql.Maybe<gql.Position>> {
    return this.withAccess('core:position:create', ctx, async () => {
      const res = (await this.knex('positions').insert(input).returning('*'))[0];

      const success = await kcClient.createPosition(res.id, false);

      if (!success) {
        await this.knex('positions').where({ id: res.id }).del();
        throw Error('Failed to find group in Keycloak');
      }

      return convertPosition(res);
    });
  }

  updatePosition(
    ctx: context.UserContext,
    id: string,
    input: sql.UpdatePosition,
  ): Promise<gql.Maybe<gql.Position>> {
    return this.withAccess('core:position:update', ctx, async () => {
      const res = (await this.knex<sql.Position>('positions').select('*').where({ id }).update(input)
        .returning('*'))[0];

      if (!res) { throw new UserInputError('id did not exist'); }

      return convertPosition(res);
    });
  }

  removePosition(ctx: context.UserContext, id: string): Promise<gql.Maybe<gql.Position>> {
    return this.withAccess('core:position:delete', ctx, async () => {
      const res = (await this.knex<sql.Position>('positions').select('*').where({ id }))[0];

      if (!res) { throw new UserInputError('position did not exist'); }

      await this.knex('positions').where({ id }).del();

      return convertPosition(res);
    });
  }
}
