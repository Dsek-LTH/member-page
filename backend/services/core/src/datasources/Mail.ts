import { ApolloError, UserInputError } from 'apollo-server';
import { dbUtils, context, UUID } from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import { convertPosition } from '../shared/converters';

export default class MailAPI extends dbUtils.KnexDataSource {
  createAlias(
    ctx: context.UserContext,
    input: gql.CreateMailAlias,
  ): Promise<gql.Maybe<gql.MailAlias>> {
    return this.withAccess('core:mail:alias:create', ctx, async () => {
      const position = await dbUtils.unique(this.knex<sql.Position>('positions').select('*').where({ id: input.position_id }));
      if (!position) throw new ApolloError('Position does not exist');
      const existingAlias = await this.knex<sql.MailAlias>('email_aliases').select('*').where({ email: input.email, position_id: input.position_id }).first();
      if (existingAlias) {
        throw new UserInputError('This alias already exists.');
      }
      const insertedMailAlias = (await this.knex<sql.MailAlias>('email_aliases').insert([input]).returning('*'))[0];
      return { ...insertedMailAlias, policies: [] };
    });
  }

  removeAlias(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.MailAlias>> {
    return this.withAccess('core:mail:alias:create', ctx, async () => {
      const aliasToDelete = await dbUtils.unique(this.knex<sql.MailAlias>('email_aliases').select('*').where({ id }));
      if (!aliasToDelete) {
        throw new UserInputError('This alias does not exists.');
      }
      await this.knex('email_aliases').where({ id }).del();
      return { ...aliasToDelete, policies: [] };
    });
  }

  getAlias(ctx: context.UserContext, email: string): Promise<gql.Maybe<gql.MailAlias>> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const alias = await this.knex<sql.MailAlias>('email_aliases').select('*').where({ email }).first();
      if (alias) {
        return {
          email: alias.email,
          policies: [], // Policies will be added by its own resolver
        };
      }
      return undefined;
    });
  }

  getAliases(ctx: context.UserContext): Promise<gql.MailAlias[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const aliases = await this.knex<sql.MailAlias>('email_aliases');
      const emails = [...new Set(aliases.map((alias) => alias.email))].sort();
      return emails.map((alias) => ({ email: alias, policies: [] }));
    });
  }

  getPoliciesFromAlias(
    ctx: context.UserContext,
    email: string,
  ): Promise<gql.MailAliasPolicy[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const aliases = await this.knex<sql.MailAlias>('email_aliases').select('*').where({ email });
      const positionIds = aliases.map((mail_alias) => mail_alias.position_id);
      const positions = await this.knex<sql.Position>('positions').select('*').whereIn('id', positionIds);
      return aliases.map((mailAlias, i) => ({
        id: mailAlias.id,
        position: convertPosition(positions[i], []),
      }));
    });
  }

  resolveRecipients(
    ctx: context.UserContext,
  ): Promise<gql.MailRecipient[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const query = this.knex<sql.MailAlias & sql.Mandate & sql.Member & sql.Keycloak>('email_aliases');
      query.join('mandates', 'email_aliases.position_id', '=', 'mandates.position_id');
      query.join('members', 'mandates.member_id', '=', 'members.id');
      query.join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id')
        .where('mandates.start_date', '<=', this.knex.fn.now())
        .andWhere('mandates.end_date', '>=', this.knex.fn.now());
      const data = await query;

      const uniqueAliases = [...new Set(data.map((row) => row.email))];
      return uniqueAliases.map((alias) => ({
        alias,
        emailUsers: data.filter((row) => row.email === alias).map((row) => ({
          keycloakId: row.keycloak_id,
          studentId: row.student_id,
        })),
      }));
    });
  }
}
