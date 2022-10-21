import { UserInputError } from 'apollo-server';
import { dbUtils, context, UUID } from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export const convertCommittee = (committee: sql.Committee): gql.Committee => {
  const { short_name, ...rest } = committee;
  let p: gql.Committee = {
    ...rest,
  };
  if (short_name) {
    p = {
      shortName: short_name,
      ...p,
    };
  }
  return p;
};

export default class CommitteeAPI extends dbUtils.KnexDataSource {
  getCommittee(
    ctx: context.UserContext,
    identifier: gql.CommitteeFilter,
  ): Promise<gql.Maybe<gql.Committee>> {
    return this.withAccess('core:committee:read', ctx, async () => {
      if (!identifier.id && !identifier.name) return undefined;
      const committee = await dbUtils.unique(this.knex<sql.Committee>('committees').select('*').where(identifier));
      if (!committee) return undefined;

      return convertCommittee(committee);
    });
  }

  getCommittees(
    ctx: context.UserContext,
    page: number,
    perPage: number,
    filter?: gql.CommitteeFilter,
  ): Promise<gql.CommitteePagination> {
    return this.withAccess('core:committee:read', ctx, async () => {
      const filtered = this.knex<sql.Committee>('committees').where(filter || {});

      const committees = await filtered
        .clone()
        .offset(page * perPage)
        .limit(perPage);

      const totalCommittees = parseInt((await filtered.clone().count({ count: '*' }))[0].count?.toString() || '0', 10);
      const pageInfo = dbUtils.createPageInfo(totalCommittees, page, perPage);

      return {
        committees: committees.map(convertCommittee),
        pageInfo,
      };
    });
  }

  createCommittee(
    ctx: context.UserContext,
    input: sql.CreateCommittee,
  ): Promise<gql.Maybe<gql.Committee>> {
    return this.withAccess('core:committee:create', ctx, async () => convertCommittee((await this.knex<sql.Committee>('committees').insert(input).returning('*'))[0]));
  }

  updateCommittee(
    ctx: context.UserContext,
    id: UUID,
    input: sql.UpdateCommittee,
  ): Promise<gql.Maybe<gql.Committee>> {
    return this.withAccess('core:committee:update', ctx, async () => {
      const res = (await this.knex<sql.Committee>('committees').where({ id }).update(input).returning('*'))[0];

      if (!res) { throw new UserInputError('id did not exist'); }

      return convertCommittee(res);
    });
  }

  removeCommittee(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Committee>> {
    return this.withAccess('core:committee:delete', ctx, async () => {
      const res = (await this.knex<sql.Committee>('committees').select('*').where({ id }))[0];

      if (!res) { throw new UserInputError('committee did not exist'); }

      await this.knex('committees').where({ id }).del();
      return convertCommittee(res);
    });
  }
}
