import { ApolloError, UserInputError } from 'apollo-server';
import {
  dbUtils, context, UUID, createLogger,
} from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import { convertPosition } from '../shared/converters';
import { convertSpecialReceiver, convertSpecialSender } from '../shared/converters/mailConverters';

const logger = createLogger('mail-api');

const isSpecialReceiver = (receiver: any):
 receiver is sql.SpecialReceiver => receiver.target_email && !receiver.keycloak_id;

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

  updateSenderStatus(
    ctx: context.UserContext,
    input: gql.MailAliasStatus[],
  ) {
    return this.withAccess('core:mail:alias:update', ctx, async () => {
      const promises = input.map(async (alias) => {
        const aliasToUpdate = await dbUtils.unique(this.knex<sql.MailAlias>('email_aliases').select('*').where({ id: alias.id }));
        if (!aliasToUpdate) {
          throw new UserInputError('This alias does not exists.');
        }
        if (alias.canSend) {
          logger.info(`${aliasToUpdate.position_id} can now send to ${aliasToUpdate.email}`);
        } else {
          logger.info(`${aliasToUpdate.position_id} can no longer send to ${aliasToUpdate.email}`);
        }
        return this.knex('email_aliases').where({ id: alias.id }).update({ can_send: alias.canSend });
      });
      await Promise.all(promises);
      return true;
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

  getAllEmails(ctx: context.UserContext): Promise<string[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const aliases = await this.knex<sql.MailAlias>('email_aliases');
      const specialSenders = await this.knex<sql.SpecialSender>('special_senders');
      const specialReceivers = await this.knex<sql.SpecialReceiver>('special_receivers');
      const emails = [
        ...new Set([
          ...aliases.map((alias) => alias.email),
          ...specialSenders.map((sender) => sender.email),
          ...specialReceivers.map((receiver) => receiver.email),
        ]),
      ].sort();
      return emails;
    });
  }

  getPoliciesFromAlias(
    ctx: context.UserContext,
    email: string,
  ): Promise<gql.MailAliasPolicy[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const aliases = await this.knex<sql.MailAlias>('email_aliases').select('*').where({ email }).orderBy('position_id', 'desc');
      const positionIds = aliases.map((mail_alias) => mail_alias.position_id);
      const positions = await this.knex<sql.Position>('positions').select('*').whereIn('id', positionIds);
      // sort positions in the same order as positionsIds
      positions.sort((a, b) => positionIds.indexOf(a.id) - positionIds.indexOf(b.id));
      return aliases.map((mailAlias, i) => ({
        id: mailAlias.id,
        position: convertPosition(positions[i], []),
        canSend: mailAlias.can_send,
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
      const regularReceivers = await query;

      const specialReceivers = await this.knex<sql.SpecialReceiver>('special_receivers');

      const data = [...regularReceivers, ...specialReceivers];

      const uniqueAliases = [
        ...new Set(data.map((row) => row.email))];
      return uniqueAliases.map((alias) => ({
        alias,
        emailUsers: data.filter((row) => row.email === alias).map((row) => {
          if (isSpecialReceiver(row)) {
            return ({
              email: row.target_email,
            });
          }
          return ({
            keycloakId: row.keycloak_id,
            studentId: row.student_id,
          });
        }),
      }));
    });
  }

  resolveSenders(
    ctx: context.UserContext,
  ): Promise<gql.MailRecipient[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const query = this.knex<sql.MailAlias & sql.Mandate & sql.Member & sql.Keycloak>('email_aliases');
      query.join('mandates', 'email_aliases.position_id', '=', 'mandates.position_id');
      query.join('members', 'mandates.member_id', '=', 'members.id');
      query.join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id')
        .where('mandates.start_date', '<=', this.knex.fn.now())
        .andWhere('mandates.end_date', '>=', this.knex.fn.now());
      query.where('email_aliases.can_send', true);
      const regularSenders = await query;
      const specialSenders = await this.knex<sql.SpecialSender>('special_senders');

      const data = [...regularSenders, ...specialSenders];
      const uniqueAliases = [
        ...new Set(data.map((row) => row.email))];
      return uniqueAliases.map((alias) => ({
        alias,
        emailUsers: data.filter((row) => row.email === alias).map((row) => ({
          keycloakId: row.keycloak_id,
          studentId: row.student_id,
        })),
      }));
    });
  }

  getSpecialReceiversForAlias(ctx: context.UserContext, alias: string):
  Promise<gql.SpecialReceiver[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const specialReceivers = await this.knex<sql.SpecialReceiver>('special_receivers').select('*').where({ email: alias });
      return specialReceivers.map((specialReceiver) => ({
        id: specialReceiver.id,
        targetEmail: specialReceiver.target_email,
      }));
    });
  }

  getSpecialSendersForAlias(ctx: context.UserContext, alias: string):
  Promise<gql.SpecialSender[]> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const specialSenders = await this.knex<sql.SpecialSender>('special_senders').select('*').where({ email: alias });
      return specialSenders.map((specialSender) => ({
        id: specialSender.id,
        keycloakId: specialSender.keycloak_id,
        studentId: specialSender.student_id,
      }));
    });
  }

  createSpecialSender(ctx: context.UserContext, input: gql.CreateSpecialSender):
  Promise<gql.SpecialSender> {
    return this.withAccess('core:mail:alias:create', ctx, async () => {
      const created = (await this.knex<sql.SpecialSender>('special_senders').insert({
        email: input.alias,
        keycloak_id: input.keycloakId,
        student_id: input.studentId,
      }).returning('*'))[0];
      return convertSpecialSender(created);
    });
  }

  createSpecialReceiver(ctx: context.UserContext, input: gql.CreateSpecialReceiver):
  Promise<gql.SpecialReceiver> {
    return this.withAccess('core:mail:alias:create', ctx, async () => {
      const created = (await this.knex<sql.SpecialReceiver>('special_receivers').insert({
        email: input.alias,
        target_email: input.targetEmail,
      }).returning('*'))[0];
      return convertSpecialReceiver(created);
    });
  }

  removeSpecialSender(ctx: context.UserContext, specialSenderId: UUID):
  Promise<gql.SpecialSender> {
    return this.withAccess('core:mail:alias:create', ctx, async () => {
      const deleted = (await this.knex<sql.SpecialSender>('special_senders').where({ id: specialSenderId }).del().returning('*'))[0];
      return convertSpecialSender(deleted);
    });
  }

  removeSpecialReceiver(ctx: context.UserContext, specialReceiverId: UUID):
  Promise<gql.SpecialReceiver> {
    return this.withAccess('core:mail:alias:create', ctx, async () => {
      const deleted = (await this.knex<sql.SpecialReceiver>('special_receivers').where({ id: specialReceiverId }).del().returning('*'))[0];
      return convertSpecialReceiver(deleted);
    });
  }
}
