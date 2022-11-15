/* eslint-disable max-len */
import { UserInputError } from 'apollo-server';
import {
  context, createLogger, dbUtils, UUID,
} from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';
import {
  convertMandate, populateMandates, todayInInterval,
} from '../shared/converters';

const logger = createLogger('core-service');

export default class MandateAPI extends dbUtils.KnexDataSource {
  getMandate(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Mandate>> {
    return this.withAccess('core:mandate:read', ctx, async () => {
      const res = (await this.knex<sql.Mandate>('mandates').select('*').where({ id }))[0];

      if (!res) { return undefined; }
      return convertMandate(res);
    });
  }

  getMandates(
    ctx: context.UserContext,
    page: number,
    perPage: number,
    filter?: gql.MandateFilter,
  ): Promise<gql.MandatePagination> {
    return this.withAccess('core:mandate:read', ctx, async () => {
      let filtered = this.knex<sql.Mandate>('mandates');

      if (filter) {
        if (filter.id) {
          filtered = filtered.where({ id: filter.id });
        }

        if (filter.position_id) {
          filtered = filtered.where({ position_id: filter.position_id });
        }

        if (filter.position_ids) {
          filtered = filtered.whereIn('position_id', filter.position_ids);
        }

        if (filter.member_id) {
          filtered = filtered.where({ member_id: filter.member_id });
        }

        if (filter.start_date || filter.end_date) {
          if (!filter.end_date) {
            filtered = filtered.where('start_date', '>=', filter.start_date);
          } else if (!filter.start_date) {
            filtered = filtered.where('start_date', '<=', filter.end_date);
          } else {
            filtered = filtered.whereBetween('start_date', [filter.start_date, filter.end_date]);
          }
        }
      }

      const res = await filtered
        .clone()
        .offset(page * perPage)
        .orderBy('start_date', 'desc')
        .limit(perPage);

      const members = await this.knex<sql.Member>('members').whereIn('id', res.map((m) => m.member_id));
      const positions = await this.knex<sql.Position>('positions').whereIn('id', res.map((m) => m.position_id));
      const mandates = res.map((m) => convertMandate(m));
      const totalMandates = Number((await filtered.clone().count({ count: '*' }))[0].count?.toString() || '0');
      const pageInfo = dbUtils.createPageInfo(<number>totalMandates, page, perPage);
      return {
        mandates: populateMandates(mandates, members, positions),
        pageInfo,
      };
    });
  }

  getMandatesForMember(
    ctx: context.UserContext,
    memberId: UUID,
    onlyActive: boolean,
  ): Promise<gql.Mandate[]> {
    return this.withAccess('core:mandate:read', ctx, async () => {
      const res = await this.knex<sql.Mandate>('mandates').select('*').where({ member_id: memberId });
      if (onlyActive) {
        const filtered = res.filter((m) => todayInInterval(m.start_date, m.end_date));
        return filtered.map(convertMandate);
      }
      return res.map(convertMandate);
    });
  }

  private async getKeycloakId(memberId: UUID): Promise<string> {
    return (await this.knex<sql.Member & sql.Keycloak>('members').join('keycloak', 'members.id', 'keycloak.member_id').select('keycloak_id').where({ id: memberId }))[0]?.keycloak_id;
  }

  createMandate(
    ctx: context.UserContext,
    input: gql.CreateMandate,
  ): Promise<gql.Maybe<gql.Mandate>> {
    return this.withAccess('core:mandate:create', ctx, async () => {
      const res = (await this.knex<sql.Mandate>('mandates').insert(input).returning('*'))[0];
      if (todayInInterval(res.start_date, res.end_date)) {
        const keycloakId = await this.getKeycloakId(res.member_id);
        try {
          await kcClient.createMandate(keycloakId, res.position_id);
        } catch (err) {
          logger.error(err);
        }
        await this.knex('mandates').where({ id: res.id }).update({ in_keycloak: true });
      }

      return convertMandate(res);
    });
  }

  updateMandate(
    ctx: context.UserContext,
    id: UUID,
    input: gql.UpdateMandate,
  ): Promise<gql.Maybe<gql.Mandate>> {
    return this.withAccess('core:mandate:update', ctx, async () => {
      const res = (await this.knex<sql.Mandate>('mandates').select('*').where({ id }).update(input)
        .returning('*'))[0];

      if (!res) { throw new UserInputError('id did not exist'); }

      const keycloakId = await this.getKeycloakId(res.member_id);
      if (todayInInterval(res.start_date, res.end_date)) {
        try {
          await kcClient.createMandate(keycloakId, res.position_id);
        } catch (err) {
          logger.error(err);
        }
        await this.knex('mandates').where({ id: res.id }).update({ in_keycloak: true });
      } else {
        try {
          await kcClient.deleteMandate(keycloakId, res.position_id);
        } catch (err) {
          logger.error(err);
        }
        await this.knex('mandates').where({ id: res.id }).update({ in_keycloak: false });
      }

      return convertMandate(res);
    });
  }

  removeMandate(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Mandate>> {
    return this.withAccess('core:mandate:delete', ctx, async () => {
      const mandate = (await this.knex<sql.Mandate>('mandates').select('*').where({ id }).first());

      if (!mandate) { throw new UserInputError('mandate did not exist'); }

      const similarMandates = (await this.knex<sql.Mandate>('mandates')
        .where({ member_id: mandate.member_id, position_id: mandate.position_id }))
        .filter((m) => todayInInterval(m.start_date, m.end_date));

      if (similarMandates.length === 1) {
        logger.info('Removing mandate from keycloak');
        const keycloakId = await this.getKeycloakId(mandate.member_id);
        try {
          await kcClient.deleteMandate(keycloakId, mandate.position_id);
        } catch (err) {
          logger.error(err);
        }
      } else {
        logger.info(`Not removing mandate from keycloak since there are duplicates: ${JSON.stringify(similarMandates)}`);
      }
      await this.knex('mandates').where({ id }).del();
      return convertMandate(mandate);
    });
  }
}
