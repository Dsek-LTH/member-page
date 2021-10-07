import { ForbiddenError, UserInputError } from 'apollo-server';
import { context, dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';

export default class MandateAPI extends dbUtils.KnexDataSource {

  private convertMandate(mandate: sql.Mandate): gql.Mandate {
    const { position_id, member_id, ...rest } = mandate;

    const m: gql.Mandate = {
      position: { id: position_id },
      member: { id: member_id },
      ...rest
    }

    return m;
  }

  async getMandates(page: number, perPage: number, filter?: gql.MandateFilter): Promise<gql.MandatePagination> {
    let filtered = this.knex<sql.Mandate>('mandates');

    if(filter) {
      if(filter.id)
        filtered = filtered.where({id: filter.id})

      if(filter.position_id)
        filtered = filtered.where({position_id: filter.position_id})

      if(filter.member_id)
        filtered = filtered.where({member_id: filter.member_id})

      if(filter.start_date || filter.end_date) {
        if(!filter.end_date)
          filtered = filtered.where('start_date', '>=', filter.start_date)
        else if(!filter.start_date)
          filtered = filtered.where('start_date', '<=', filter.end_date)
        else
          filtered = filtered.whereBetween('start_date', [filter.start_date, filter.end_date])
      }
    }

    const res =  await filtered
      .clone()
      .offset(page * perPage)
      .orderBy("start_date", "desc")
      .limit(perPage);
    const mandates =  res.map(m => this.convertMandate(m));

    const totalMandates = (await filtered.clone().count({ count: '*' }))[0].count || 0;
    const pageInfo = dbUtils.createPageInfo(<number>totalMandates, page, perPage)

    return {
      mandates: mandates,
      pageInfo: pageInfo
    }
  }

  private todayInInterval(start: Date, end: Date): boolean {
    const today = new Date();
    return today >= start && today <= end;
  }

  private async getKeycloakId(memberId: number): Promise<string> {
    return (await this.knex<sql.Member & sql.Keycloak>('members').join('keycloak', 'members.id', 'keycloak.member_id').select('keycloak_id').where({id: memberId}))[0];
  }

  async createMandate(context: context.UserContext | undefined, input: gql.CreateMandate): Promise<gql.Maybe<gql.Mandate>> {
    if (!context?.user)
      throw new ForbiddenError('Operation denied');

    const res = (await this.knex<sql.Mandate>('mandates').insert(input).returning('*'))[0];

    if (this.todayInInterval(res.start_date, res.end_date)) {
      const keycloakId = await this.getKeycloakId(res.member_id);
      await kcClient.createMandate(keycloakId, res.position_id);
    }

    return this.convertMandate(res);
  }

  async updateMandate(context: context.UserContext | undefined, id: number, input: gql.UpdateMandate): Promise<gql.Maybe<gql.Mandate>> {
    if (!context?.user)
      throw new ForbiddenError('Operation denied');

    await this.knex<sql.Mandate>('mandates').select('*').where({id}).update(input);
    const res = (await this.knex<sql.Mandate>('mandates').select('*').where({id}))[0];

    if (!res)
      throw new UserInputError('id did not exist');

    const keycloakId = await this.getKeycloakId(res.member_id);
    if (this.todayInInterval(res.start_date, res.end_date)) {
      await kcClient.createMandate(keycloakId, res.position_id);
    } else {
      await kcClient.deleteMandate(keycloakId, res.position_id);
    }

    return this.convertMandate(res);
  }

  async removeMandate(context: context.UserContext | undefined, id: number): Promise<gql.Maybe<gql.Mandate>> {
    if (!context?.user)
      throw new ForbiddenError('Operation denied');

    const res = (await this.knex<sql.Mandate>('mandates').select('*').where({id}))[0]

    if (!res)
      throw new UserInputError('mandate did not exist');

    const keycloakId = await this.getKeycloakId(res.member_id);
    await kcClient.deleteMandate(keycloakId, res.position_id);

    await this.knex('mandates').where({id}).del();
    return this.convertMandate(res);
  }
}