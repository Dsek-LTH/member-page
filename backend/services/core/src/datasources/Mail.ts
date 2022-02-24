import { UserInputError } from 'apollo-server';
import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import kcClient from '../keycloak';
import { DataSources } from '../datasources';

export default class MailAPI extends dbUtils.KnexDataSource {
    resloveAlias(ctx: context.UserContext, datasources: DataSources, alias: string,): Promise<gql.Maybe<string[]>> {
        return this.withAccess('core:mail:alias:read', ctx, async () => {
            const postion_row = await this.knex<sql.Position>('mail_aliases').select('position_id').where('email_alias', alias)
            const position_ids = postion_row.map(row => row.position_id);
            const mandates = await datasources.mandateAPI.getMandates(ctx, 0, 10, {
                position_ids: position_ids,
            });

            const members = mandates.mandates.map(mandate => mandate?.member).map(member => member?.id ? member.id : "");
            console.log("help");
            if (!members) {
                return ["root@dsek.se"]
            }

            const keycloak_ids = (await datasources.memberAPI.getKeycloakIdsFromMemberIds(members))?.map(keycloakRow => keycloakRow.keycloak_id)


            return await kcClient.getUserEmails(keycloak_ids ?? [])
        })
    }
}
