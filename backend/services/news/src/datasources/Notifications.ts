import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export default class NotificationsAPI extends dbUtils.KnexDataSource {
  registerToken(
    ctx: context.UserContext,
    expo_token: string,
  ): Promise<gql.Token> {
    return this.withAccess('tokens:register', ctx, async () => {
      if (ctx.user?.keycloak_id) {
        const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));
        const token = (await this.knex<sql.Token>('expo_tokens').insert({ expo_token, member_id: user?.member_id }).returning('*'))[0];
        return token;
      }
      const token = (await this.knex<sql.Token>('expo_tokens').insert({ expo_token }).returning('*'))[0];
      return token;
    });
  }
}
