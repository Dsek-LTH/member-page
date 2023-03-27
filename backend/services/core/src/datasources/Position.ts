import { UserInputError } from 'apollo-server';
import { dbUtils, context } from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';
import { convertPosition, todayInInterval } from '../shared/converters';

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
      const positionMandates = await this.knex<sql.Mandate>('mandates').select('*').where({ position_id: position.id });
      const activeMandates = positionMandates
        .filter((m) => todayInInterval(m.start_date, m.end_date, identifier?.year));
      return convertPosition(position, activeMandates);
    });
  }

  getPositions(
    ctx: context.UserContext,
    page: number,
    perPage: number,
    filter?: gql.PositionFilter,
  ): Promise<gql.PositionPagination> {
    return this.withAccess('core:position:read', ctx, async () => {
      let query = this.knex<sql.Position>('positions');

      if (filter?.committee_short_name === 'styr') {
        query = query.where({
          active: true,
          board_member: true,
        });
      } else if (filter?.committee_short_name) {
        const committee = await this.knex<sql.Committee>('committees')
          .where({ short_name: filter.committee_short_name })
          .first();
        if (!committee) throw new UserInputError('committee_short_name did not exist');
        query = this.knex<sql.Position>('positions').where(
          {
            active: true,
            committee_id: committee.id,
          },
        );
      } else if (filter) {
        query = this.knex<sql.Position>('positions').where({
          active: true,
          ...filter,
        });
      }

      const positions = await query
        .clone()
        .offset(page * perPage)
        .limit(perPage);

      const totalPositions = parseInt((await query.clone().count({ count: '*' }))[0].count?.toString() || '0', 10);
      const pageInfo = dbUtils.createPageInfo(<number>totalPositions, page, perPage);
      const positionIds = positions.map((position) => position.id);
      const mandates = await this.knex<sql.Mandate>('mandates').select('*').whereIn('position_id', positionIds);
      const activeMandates = mandates.filter((m) => todayInInterval(
        m.start_date,
        m.end_date,
        filter?.year,
      ));
      return {
        positions: positions
          .map((p) => convertPosition(p, activeMandates.filter((m) => m.position_id === p.id))),
        pageInfo,
      };
    });
  }

  createPosition(
    ctx: context.UserContext,
    input: gql.CreatePosition,
  ): Promise<gql.Maybe<gql.Position>> {
    return this.withAccess('core:position:create', ctx, async () => {
      const success = await kcClient.checkIfGroupExists(input.id);

      if (success) {
        const res = (await this.knex('positions').insert(input).returning('*'))[0];
        return convertPosition(res, []);
      }
      throw Error('Failed to find group in Keycloak');
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

      return convertPosition(res, []);
    });
  }

  removePosition(ctx: context.UserContext, id: string): Promise<gql.Maybe<gql.Position>> {
    return this.withAccess('core:position:delete', ctx, async () => {
      const res = (await this.knex<sql.Position>('positions').select('*').where({ id }))[0];

      if (!res) { throw new UserInputError('position did not exist'); }

      await this.knex('positions').where({ id }).del();

      return convertPosition(res, []);
    });
  }
}
