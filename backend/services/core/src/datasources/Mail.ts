import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';
import type { DataSources } from '../datasources';
import { todayInInterval } from './Mandate';

export default class MailAPI extends dbUtils.KnexDataSource {
  getMandatesFromAlias(
    ctx: context.UserContext,
    datasources: DataSources,
    alias: string,
  ): Promise<Array<gql.Maybe<gql.Mandate>>> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const postion_row = await this.knex<sql.Position>('mail_aliases')
        .select('position_id')
        .where('email_alias', alias);
      const position_ids = postion_row.map((row) => row.position_id);

      let page = 0;
      let mandates: Array<gql.Maybe<gql.Mandate>> = [];
      let mandatePage;
      while (page === 0 || mandatePage?.pageInfo?.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        mandatePage = await datasources.mandateAPI.getMandates(ctx, page, 10, {
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
    datasources: DataSources,
    alias: string,
  ): Promise<gql.Maybe<string[]>> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const mandates = await this.getMandatesFromAlias(ctx, datasources, alias);

      if (mandates.length === 0) {
        return ['root@dsek.se'];
      }

      const members = mandates
        .map((mandate) => mandate?.member)
        .map((member) => (member?.id ? member.id : ''));

      const keycloak_ids = (
        await datasources.memberAPI.getKeycloakIdsFromMemberIds(members)
      )?.map((keycloakRow) => keycloakRow.keycloak_id);

      return kcClient.getUserEmails(keycloak_ids ?? []);
    });
  }

  userHasAccessToAlias(
    ctx: context.UserContext,
    datasources: DataSources,
    alias: string,
    student_id: string,
  ): Promise<boolean> {
    return this.withAccess('core:mail:alias:read', ctx, async () => {
      const mandates = await this.getMandatesFromAlias(ctx, datasources, alias);
      const member = await datasources.memberAPI.getMember(ctx, { student_id });
      const foundMandate = mandates.some(
        (mandate) => mandate?.member?.id === member?.id,
      );
      return foundMandate;
    });
  }
}
