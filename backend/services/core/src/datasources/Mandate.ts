import { UserInputError } from 'apollo-server';
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
    const res = await this.knex<sql.DbMandate>('mandates').select('*').where(filter || {});
    return res.map(m => this.convertMandate(m));
  }

  async createMandate(context: context.UserContext | undefined, input: gql.CreateMandate): Promise<gql.Maybe<gql.Mandate>> {
    const id = (await this.knex('mandates').insert(input))[0];
    const res = (await this.knex<sql.DbMandate>('mandates').where({id}))[0];
    return this.convertMandate(res);
  }

  async updateMandate(context: context.UserContext | undefined, id: number, input: gql.UpdateMandate): Promise<gql.Maybe<gql.Mandate>> {
    await this.knex<sql.DbMandate>('mandates').select('*').where({id}).update(input);
    const res = (await this.knex<sql.DbMandate>('mandates').select('*').where({id}))[0];

    if (!res)
      throw new UserInputError('id did not exist');

    return this.convertMandate(res);
  }

  async removeMandate(context: context.UserContext | undefined, id: number): Promise<gql.Maybe<gql.Mandate>> {
    const res = (await this.knex<sql.DbMandate>('mandates').select('*').where({id}))[0]

    if (!res)
      throw new UserInputError('mandate did not exist');

    await this.knex('mandates').where({id}).del();
    return this.convertMandate(res);
  }
}