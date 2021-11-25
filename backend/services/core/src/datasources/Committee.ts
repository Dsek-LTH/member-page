import { UserInputError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export default class CommitteeAPI extends dbUtils.KnexDataSource {
  getCommittee = (context: context.UserContext, identifier: gql.CommitteeFilter): Promise<gql.Maybe<gql.Committee>> =>
    this.withAccess('core:committee:read', context, async () => {
      return dbUtils.unique(this.knex<sql.Committee>('committees').select('*').where(identifier));
    })

  getCommittees = (context: context.UserContext, page: number, perPage: number, filter?: gql.CommitteeFilter): Promise<gql.CommitteePagination> =>
    this.withAccess('core:committee:read', context, async () => {
      const filtered = this.knex<sql.Committee>('committees').where(filter || {});

      const committees = await filtered
        .clone()
        .offset(page * perPage)
        .limit(perPage);

      const totalCommittees = parseInt((await filtered.clone().count({ count: '*' }))[0].count?.toString() || "0");
      const pageInfo = dbUtils.createPageInfo(totalCommittees, page, perPage)

      return {
        committees: committees,
        pageInfo: pageInfo,
      }
    });

  createCommittee = (context: context.UserContext, input: sql.CreateCommittee): Promise<gql.Maybe<gql.Committee>> =>
    this.withAccess('core:committee:create', context, async () => {
      return (await this.knex<sql.Committee>('committees').insert(input).returning('*'))[0];
    });

  updateCommittee = (context: context.UserContext, id: number, input: sql.UpdateCommittee): Promise<gql.Maybe<gql.Committee>> =>
    this.withAccess('core:committee:update', context, async () => {
      const res = (await this.knex<sql.Committee>('committees').where({ id }).update(input).returning('*'))[0];

      if (!res)
        throw new UserInputError('id did not exist');

      return res;
    });

  removeCommittee = (context: context.UserContext, id: number): Promise<gql.Maybe<gql.Committee>> =>
    this.withAccess('core:committee:delete', context, async () => {
      const res = (await this.knex<sql.Committee>('committees').select('*').where({ id }))[0]

      if (!res)
        throw new UserInputError('committee did not exist');

      await this.knex('committees').where({ id }).del();
      return res;
    });
}
