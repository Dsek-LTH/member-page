import { dbUtils, context, UUID } from 'dsek-shared';
import { UserInputError } from 'apollo-server';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';
import type { DataSources } from '../datasources';
import { todayInInterval } from './Mandate';
import { convertPosition } from './Position';

export default class MailAPI extends dbUtils.KnexDataSource {
  createAlias(
    ctx: context.UserContext,
    input: gql.CreateMailAlias,
  ): Promise<gql.Maybe<gql.MailAlias>> {
    return this.withAccess('core:mail:alias:create', ctx, async () => {
      const existing_alias = await this.knex<sql.MailAlias>('email_aliases').select('*').where({ email: input.email, position_id: input.position_id }).first();
      if (existing_alias) {
        throw new UserInputError('This alias already exists.');
      }
      const inserted_mail_alias = (await this.knex<sql.MailAlias>('email_aliases').insert([input]).returning('*'))[0];
      return { ...inserted_mail_alias, policies: [] };
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
      const position_ids = aliases.map((mail_alias) => mail_alias.position_id);
      const positions = await this.knex<sql.Position>('positions').select('*').whereIn('id', position_ids);
      return aliases.map((mailAlias, i) => ({
        id: mailAlias.id,
        position: convertPosition(positions[i], []),
      }));
    });
  }

  getMandatesFromAlias(
    ctx: context.UserContext,
    dataSources: DataSources,
    email: string,
  ): Promise<Array<gql.Maybe<gql.Mandate>>> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const postion_row = await this.knex<sql.Position>('email_aliases')
        .select('position_id')
        .where({ email });
      const position_ids = postion_row.map((row) => row.position_id);

      let page = 0;
      let mandates: Array<gql.Maybe<gql.Mandate>> = [];
      let mandatePage;
      while (page === 0 || mandatePage?.pageInfo?.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        mandatePage = await dataSources.mandateAPI.getMandates(ctx, page, 10, {
          position_ids,
        });

        mandates = mandates.concat(mandatePage.mandates);
        page += 1;
      }

      mandates = mandates.filter((m) =>
        todayInInterval(new Date(m?.start_date), new Date(m?.end_date)));
      return mandates;
    });
  }

  resolveAlias(
    ctx: context.UserContext,
    dataSources: DataSources,
    alias: string,
  ): Promise<gql.Maybe<string[]>> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const mandates = await this.getMandatesFromAlias(ctx, dataSources, alias);

      if (mandates.length === 0) {
        return ['root@dsek.se'];
      }

      const members = mandates
        .map((mandate) => mandate?.member)
        .map((member) => (member?.id ? member.id : ''));

      const keycloak_ids = (
        await dataSources.memberAPI.getKeycloakIdsFromMemberIds(members)
      )?.map((keycloakRow) => keycloakRow.keycloak_id);

      return kcClient.getUserEmails(keycloak_ids ?? []);
    });
  }

  userHasAccessToAlias(
    ctx: context.UserContext,
    dataSources: DataSources,
    alias: string,
    student_id: string,
  ): Promise<boolean> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const mandates = await this.getMandatesFromAlias(ctx, dataSources, alias);
      const member = await dataSources.memberAPI.getMember(ctx, { student_id });
      const foundMandate = mandates.some(
        (mandate) => mandate?.member?.id === member?.id,
      );
      return foundMandate;
    });
  }
}
