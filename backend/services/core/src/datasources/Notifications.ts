import { ApolloError, UserInputError } from 'apollo-server';
import { convertTag } from './News';
import {
  dbUtils, context, createLogger, UUID,
} from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/news';

const logger = createLogger('notifications');

export function convertToken(token: sql.Token) {
  const { member_id: memberId, expo_token: expoToken, ...rest } = token;
  const convertedToken: gql.Token = {
    ...rest,
    memberId,
    expoToken,
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
      const existingToken = await dbUtils.unique(this.knex<sql.Token>('expo_tokens').select('*').where({ expo_token }));
      if (ctx.user?.keycloak_id) {
        const user = await dbUtils.unique(this.knex<sql.Keycloak>('keycloak').where({ keycloak_id: ctx.user?.keycloak_id }));
        if (existingToken) {
          const newToken = await dbUtils.unique(this.knex<sql.Token>('expo_tokens').where({ id: existingToken.id }).update({ member_id: user?.member_id }).returning('*'));
          if (!newToken) {
            throw new ApolloError('token was removed unexpectedly');
          }
          return newToken;
        }
        logger.info(`Added ${expo_token} to db.`);
        const token = (await this.knex<sql.Token>('expo_tokens').insert({ expo_token, member_id: user?.member_id }).returning('*'))[0];
        return token;
      }
      if (existingToken) {
        return existingToken;
      }
      logger.info(`Added ${expo_token} to db.`);
      const token = (await this.knex<sql.Token>('expo_tokens').insert({ expo_token }).returning('*'))[0];
      return token;
    };
    const token = await register();
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
    if (!tagIds) {
      return [];
    }
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
    // Check if any are already subscribed to, then don't re-subsribe to them
    const existing = await (await this.knex<sql.TokenTags>('token_tags').select('tag_id').where({ token_id: token.id }).whereIn('tag_id', tag_ids)).map((r) => r.tag_id);

    const ids = (await this.knex<sql.TokenTags>('token_tags').insert(tag_ids.filter((t) => existing.indexOf(t) === -1).map((tag_id) => ({
      token_id: token.id,
      tag_id,
    }))).returning('id')).map((r) => r.id);
    return ids;
  }

  async unsubscribeTags(
    expo_token: string,
    tag_ids: UUID[],
  ): Promise<number> {
    const token = await this.getTokenFromExpo(expo_token);
    if (!token) {
      throw new UserInputError(`No token exists with expo_token ${expo_token}`);
    }
    // Get which ones are already subscribed to, only unsubscribe to those
    const existing = await (await this.knex<sql.TokenTags>('token_tags').select('tag_id').where({ token_id: token.id }).whereIn('tag_id', tag_ids)).map((r) => r.tag_id);

    const deletedRowAmount = await this.knex<sql.TokenTags>('token_tags').where({
      token_id: token.id,
    }).whereIn('tag_id', tag_ids.filter((t) => existing.indexOf(t) !== -1)).del();
    return deletedRowAmount;
  }
}
