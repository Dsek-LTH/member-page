import { ForbiddenError, UserInputError } from 'apollo-server';
import { context, dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class MandateAPI extends dbUtils.KnexDataSource {

  private convertMandate(mandate: sql.DbMandate): gql.Mandate {
    const { position_id, member_id, ...rest } = mandate;

    const m: gql.Mandate = {
      position: { id: position_id },
      member: { id: member_id },
      ...rest
    }

    return m;
  }

  async getMandates(page: number, perPage: number, filter?: gql.MandateFilter): Promise<gql.MandatePagination> {
    let filtered = this.knex<sql.DbMandate>('mandates').select('*');

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

    const totalMandates = (await filtered).length;
    const pageInfo = dbUtils.createPageInfo(<number>totalMandates, page, perPage)

    const res =  filtered
      .offset(page * perPage)
      .orderBy("start_date", "desc")
      .limit(perPage);

    const mandates =  (await res).map(m => this.convertMandate(m));

    return {
      mandates: mandates,
      pageInfo: pageInfo
    }
  }

  async createMandate(context: context.UserContext | undefined, input: gql.CreateMandate): Promise<gql.Maybe<gql.Mandate>> {
    if (!context?.user)
      throw new ForbiddenError('Operation denied');

    const id = (await this.knex('mandates').insert(input))[0];
    const res = (await this.knex<sql.DbMandate>('mandates').where({id}))[0];

    return this.convertMandate(res);
  }

  async updateMandate(context: context.UserContext | undefined, id: number, input: gql.UpdateMandate): Promise<gql.Maybe<gql.Mandate>> {
    if (!context?.user)
      throw new ForbiddenError('Operation denied');

    await this.knex<sql.DbMandate>('mandates').select('*').where({id}).update(input);
    const res = (await this.knex<sql.DbMandate>('mandates').select('*').where({id}))[0];

    if (!res)
      throw new UserInputError('id did not exist');

    return this.convertMandate(res);
  }

  async removeMandate(context: context.UserContext | undefined, id: number): Promise<gql.Maybe<gql.Mandate>> {
    if (!context?.user)
      throw new ForbiddenError('Operation denied');

    const res = (await this.knex<sql.DbMandate>('mandates').select('*').where({id}))[0]

    if (!res)
      throw new UserInputError('mandate did not exist');

    await this.knex('mandates').where({id}).del();
    return this.convertMandate(res);
  }
}