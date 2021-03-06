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

  async getMandates(filter?: gql.MandateFilter): Promise<gql.Mandate[]> {
    let res = this.knex<sql.DbMandate>('mandates').select('*');

    if(filter) {
      if(filter.id)
        res = res.where({id: filter.id})

      if(filter.position_id)
        res = res.where({position_id: filter.position_id})

      if(filter.member_id)
        res = res.where({member_id: filter.member_id})

      if(filter.start_date || filter.end_date) {
        if(!filter.end_date)
            res = res.where('start_date', '>=', filter.start_date)
        else if(!filter.start_date)
            res = res.where('start_date', '<=', filter.end_date)
        else
            res = res.whereBetween('start_date', [filter.start_date, filter.end_date])
      }
    }

    return (await res).map(m => this.convertMandate(m));
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