import {
  dbUtils, context, createLogger, UUID,
} from 'dsek-shared';
import { UserInputError } from 'apollo-server';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import { convertTag } from './News';

const logger = createLogger('notifications');

export function convertToken(token: sql.Token) {
  const { member_id, expo_token, ...rest } = token;
  const convertedToken: gql.Token = {
    ...rest,
    memberId: member_id,
    expoToken: expo_token,
    tagSubscriptions: [],
  };
  return convertedToken;
}

export default class NotificationsAPI extends dbUtils.KnexDataSource {
  async registerToken(
    ctx: context.UserContext,
    expo_token: string,
  ): Promise<gql.Token> {
    const register = async () => {
      if (ctx.user?.keycloak_id) {
        const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));
        const token = (await this.knex<sql.Token>('expo_tokens').insert({ expo_token, member_id: user?.member_id }).returning('*'))[0];
        return token;
      }
      const token = (await this.knex<sql.Token>('expo_tokens').insert({ expo_token }).returning('*'))[0];
      return token;
    };
    const token = await register();
    logger.info(`Added ${expo_token} to db.`);
    return convertToken(token);
  }

  private async getTokenFromExpo(expo_token: string): Promise<gql.Maybe<sql.Token>> {
    return dbUtils.unique(this.knex<sql.Token>('expo_tokens').where({ expo_token }));
  }

  async getToken(
    expo_token: string,
  ): Promise<gql.Maybe<gql.Token>> {
    const token = await this.getTokenFromExpo(expo_token);
    if (!token) {
      return undefined;
    }
    return convertToken(token);
  }

  async getSubscribedTags(
    token_id: UUID,
  ): Promise<gql.Tag[]> {
    const tagIds: sql.TokenTags['tag_id'][] = (await this.knex<sql.TokenTags>('token_tags').select('tag_id').where({ token_id }))
      .map((t) => t.tag_id);
    const tags: sql.Tag[] = await this.knex<sql.Tag>('tags').whereIn('id', tagIds);

    return tags.map(convertTag);
  }

  async subscribeTags(
    expo_token: string,
    tag_ids: UUID[],
  ): Promise<UUID[]> {
    const token = await this.getTokenFromExpo(expo_token);
    if (!token) {
      throw new UserInputError(`No token exists with expo_token ${expo_token}`);
    }
    const id = await this.knex<sql.TokenTags>('token_tags').insert(tag_ids.map((tag_id) => ({
      token_id: token.id,
      tag_id,
    }))).returning('id');
    return id;
  }

  async unsubscribeTags(
    expo_token: string,
    tag_ids: UUID[],
  ): Promise<number> {
    const token = await this.getTokenFromExpo(expo_token);
    if (!token) {
      throw new UserInputError(`No token exists with expo_token ${expo_token}`);
    }
    const deletedRowAmount = await this.knex<sql.TokenTags>('token_tags').where({
      token_id: token.id,
    }).whereIn('tag_id', tag_ids).del();
    return deletedRowAmount;
  }
}
