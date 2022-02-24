import { UserInputError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';
import { DataSources } from '../datasources';

export default class MailAPI extends dbUtils.KnexDataSource {
    resolveAlias(ctx: context.UserContext, datasources: DataSources, alias: string,): Promise<gql.Maybe<string[]>> {
        return this.withAccess('core:mail:alias:read', ctx, async () => {
            const postion_row = await this.knex<sql.Position>('mail_aliases').select('position_id').where('email_alias', alias)
            const position_ids = postion_row.map(row => row.position_id);

            let page = 0;

            let mandates: Array<gql.Maybe<gql.Mandate>> = [];
            let mandatePage = undefined;

            while (page == 0 || mandatePage?.pageInfo?.hasNextPage) {
                mandatePage = await datasources.mandateAPI.getMandates(ctx, page, 10, {
                    position_ids: position_ids,
                });
                mandates = mandates.concat(mandatePage.mandates);
                page += 1;
            }

            console.log("mandates")
            const members = mandates.map(mandate => mandate?.member).map(member => member?.id ? member.id : "");
            /* console.log("help");
             if (!members) {
                 return ["root@dsek.se"]
             }*/

            const keycloak_ids = (await datasources.memberAPI.getKeycloakIdsFromMemberIds(members))?.map(keycloakRow => keycloakRow.keycloak_id)


            return await kcClient.getUserEmails(keycloak_ids ?? [])
        })
    }
}
