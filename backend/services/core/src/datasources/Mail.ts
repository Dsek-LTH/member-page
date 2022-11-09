import { UserInputError } from 'apollo-server';
import { dbUtils, context, UUID } from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';
import type { DataSources } from '../datasources';
import { convertPosition, todayInInterval } from '../shared/converters';

export default class MailAPI extends dbUtils.KnexDataSource {
  createAlias(
    ctx: context.UserContext,
    input: gql.CreateMailAlias,
  ): Promise<gql.Maybe<gql.MailAlias>> {
    return this.withAccess('core:mail:alias:create', ctx, async () => {
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

  getMandatesFromAlias(
    ctx: context.UserContext,
    dataSources: DataSources,
    email: string,
  ): Promise<Array<gql.Maybe<gql.FastMandate>>> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const positionRow = await this.knex<sql.Position>('email_aliases')
        .select('position_id')
        .where({ email });
      const positionIds = positionRow.map((row) => row.position_id);

      let page = 0;
      let mandates: Array<gql.Maybe<gql.FastMandate>> = [];
      let mandatePage;
      while (page === 0 || mandatePage?.pageInfo?.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        mandatePage = await dataSources.mandateAPI.getMandates(ctx, page, 100, {
          position_ids: positionIds,
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

      const keycloakIds = (
        await dataSources.memberAPI.getKeycloakIdsFromMemberIds(members)
      )?.map((keycloakRow) => keycloakRow.keycloak_id);

      return kcClient.getUserEmails(keycloakIds ?? []);
    });
  }

  resolveRecipients(
    ctx: context.UserContext,
    dataSources: DataSources,
  ): Promise<gql.MailRecipient[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const aliases = [...new Set((await this.knex<sql.MailAlias>('email_aliases').select('email')).map((a) => a.email))];
      const result: gql.MailRecipient[] = [];
      for (let i = 0; i < aliases.length; i += 1) {
        const alias = aliases[i];
        result.push(
          {
            alias,
            // eslint-disable-next-line no-await-in-loop
            emails: await this.resolveAlias(ctx, dataSources, alias),
          },
        );
      }
      return result;
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
