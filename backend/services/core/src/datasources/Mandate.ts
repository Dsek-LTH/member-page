/* eslint-disable max-len */
import { UserInputError } from 'apollo-server';
import {
  context, createLogger, dbUtils, UUID,
} from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';

const logger = createLogger('core-service');

export function convertMandate(mandate: sql.Mandate): gql.Mandate {
  const {
    position_id, member_id, start_date, end_date, ...rest
  } = mandate;

  const toDate = (d: Date) => `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}-${(`0${d.getDate()}`).slice(-2)}`;

  const m: gql.Mandate = {
    position: { id: position_id },
    member: { id: member_id },
    start_date: toDate(start_date),
    end_date: toDate(end_date),
    ...rest,
  };

  return m;
}

export function todayInInterval(start: Date, end: Date): boolean {
  const today = new Date();
  return today >= start && today <= end;
}

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
      const mandates = res.map((m) => convertMandate(m));

      const totalMandates = parseInt((await filtered.clone().count({ count: '*' }))[0].count?.toString() || '0', 10);
      const pageInfo = dbUtils.createPageInfo(<number>totalMandates, page, perPage);
      return {
        mandates,
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
        await kcClient.createMandate(keycloakId, res.position_id);
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
        await kcClient.createMandate(keycloakId, res.position_id);
        await this.knex('mandates').where({ id: res.id }).update({ in_keycloak: true });
      } else {
        await kcClient.deleteMandate(keycloakId, res.position_id);
        await this.knex('mandates').where({ id: res.id }).update({ in_keycloak: false });
      }

      return convertMandate(res);
    });
  }

  removeMandate(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Mandate>> {
    return this.withAccess('core:mandate:delete', ctx, async () => {
      const res = (await this.knex<sql.Mandate>('mandates').select('*').where({ id }))[0];

      if (!res) { throw new UserInputError('mandate did not exist'); }

      const keycloakId = await this.getKeycloakId(res.member_id);
      await kcClient.deleteMandate(keycloakId, res.position_id);
      await this.knex('mandates').where({ id }).del();
      return convertMandate(res);
    });
  }

  syncMandatesWithKeycloak(ctx: context.UserContext): Promise<boolean> {
    return this.withAccess('core:admin', ctx, async () => {
      logger.info('Updating keycloak mandates');

      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().substring(0, 10);

      const expiredMandates = await this.knex('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '<', yesterday).where({ in_keycloak: true })
        .select('keycloak_id', 'position_id', 'mandates.id');
      logger.info(`Found ${expiredMandates.length} expired mandates.`);

      const mandatesToAdd = await this.knex<{ keycloak_id: string, position_id: string }>('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '>', yesterday).where({ in_keycloak: false })
        .select('keycloak.keycloak_id', 'mandates.position_id', 'mandates.id');
      logger.info(`Found ${mandatesToAdd.length} mandates to add.`);

      logger.info('Updating keycloak...');
      await Promise.all(mandatesToAdd.map((mandate) => kcClient
        .createMandate(mandate.keycloak_id, mandate.position_id)
        .then(async () => {
          await this.knex('mandates').where({ id: mandate.id }).update({ in_keycloak: true });
          logger.info(`Created mandate ${mandate.keycloak_id}->${mandate.position_id}`);
        })
        .catch(() => logger.info(`Failed to create mandate ${mandate.keycloak_id}->${mandate.position_id}`))));

      await Promise.all(expiredMandates.map((mandate) => kcClient
        .deleteMandate(mandate.keycloak_id, mandate.position_id)
        .then(async () => {
          await this.knex('mandates').where({ id: mandate.id }).update({ in_keycloak: false });
          logger.info(`Deleted mandate ${mandate.keycloak_id}->${mandate.position_id}`);
        })
        .catch(() => logger.info(`Failed to delete mandate ${mandate.keycloak_id}->${mandate.position_id}`))));
      logger.info('Done updating mandates');
      return true;
    });
  }
}
