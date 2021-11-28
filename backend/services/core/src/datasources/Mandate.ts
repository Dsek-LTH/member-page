import { UserInputError } from 'apollo-server';
import { context, dbUtils, UUID } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';

export function convertMandate(mandate: sql.Mandate): gql.Mandate {
  const { position_id, member_id, start_date, end_date, ...rest } = mandate;

  const toDate = (d: Date) => `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`

  const m: gql.Mandate = {
    position: { id: position_id },
    member: { id: member_id },
    start_date: toDate(start_date),
    end_date: toDate(end_date),
    ...rest
  }

  return m;
}


export default class MandateAPI extends dbUtils.KnexDataSource {

  getMandates = (context: context.UserContext, page: number, perPage: number, filter?: gql.MandateFilter): Promise<gql.MandatePagination> =>
    this.withAccess('core:mandate:read', context, async () => {
      let filtered = this.knex<sql.Mandate>('mandates');

      if (filter) {
        if (filter.id)
          filtered = filtered.where({ id: filter.id })

        if (filter.position_id)
          filtered = filtered.where({ position_id: filter.position_id })

        if (filter.member_id)
          filtered = filtered.where({ member_id: filter.member_id })

        if (filter.start_date || filter.end_date) {
          if (!filter.end_date)
            filtered = filtered.where('start_date', '>=', filter.start_date)
          else if (!filter.start_date)
            filtered = filtered.where('start_date', '<=', filter.end_date)
          else
            filtered = filtered.whereBetween('start_date', [filter.start_date, filter.end_date])
        }
      }

      const res = await filtered
        .clone()
        .offset(page * perPage)
        .orderBy("start_date", "desc")
        .limit(perPage);
      const mandates = res.map(m => convertMandate(m));

      const totalMandates = parseInt((await filtered.clone().count({ count: '*' }))[0].count?.toString() || "0");
      const pageInfo = dbUtils.createPageInfo(<number>totalMandates, page, perPage)

      return {
        mandates: mandates,
        pageInfo: pageInfo
      }
    });

  private todayInInterval(start: Date, end: Date): boolean {
    const today = new Date();
    return today >= start && today <= end;
  }

  private async getKeycloakId(memberId: UUID): Promise<string> {
    return (await this.knex<sql.Member & sql.Keycloak>('members').join('keycloak', 'members.id', 'keycloak.member_id').select('keycloak_id').where({ id: memberId }))[0]?.keycloak_id;
  }

  createMandate = (context: context.UserContext, input: gql.CreateMandate): Promise<gql.Maybe<gql.Mandate>> =>
    this.withAccess('core:mandate:create', context, async () => {
      const res = (await this.knex<sql.Mandate>('mandates').insert(input).returning('*'))[0];
      if (this.todayInInterval(res.start_date, res.end_date)) {
        const keycloakId = await this.getKeycloakId(res.member_id);
        await kcClient.createMandate(keycloakId, res.position_id);
      }

      return convertMandate(res);
    });

  updateMandate = (context: context.UserContext, id: UUID, input: gql.UpdateMandate): Promise<gql.Maybe<gql.Mandate>> =>
    this.withAccess('core:mandate:update', context, async () => {
      const res = (await this.knex<sql.Mandate>('mandates').select('*').where({ id }).update(input).returning('*'))[0];

      if (!res)
        throw new UserInputError('id did not exist');

      const keycloakId = await this.getKeycloakId(res.member_id);
      if (this.todayInInterval(res.start_date, res.end_date)) {
        await kcClient.createMandate(keycloakId, res.position_id);
      } else {
        await kcClient.deleteMandate(keycloakId, res.position_id);
      }

      return convertMandate(res);
    });

  removeMandate = (context: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Mandate>> =>
    this.withAccess('core:mandate:delete', context, async () => {
      const res = (await this.knex<sql.Mandate>('mandates').select('*').where({ id }))[0]

      if (!res)
        throw new UserInputError('mandate did not exist');

      const keycloakId = await this.getKeycloakId(res.member_id);
      await kcClient.deleteMandate(keycloakId, res.position_id);

      await this.knex('mandates').where({ id }).del();
      return convertMandate(res);
    });
}