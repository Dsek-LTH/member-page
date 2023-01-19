import { ApolloError } from 'apollo-server';
import
{
  context, createLogger, dbUtils, UUID,
} from '../shared';
import { convertNotification } from '../shared/converters';
import * as gql from '../types/graphql';
import * as sql from '../types/news';
import { Token, TagSubscription, SQLNotification } from '../types/notifications';
import { convertTag } from './News';

const logger = createLogger('notifications');

export function convertToken(token: Token) {
  const { member_id: memberId, ...rest } = token;
  const convertedToken: gql.Token = {
    ...rest,
    memberId,
  };
  return convertedToken;
}

export default class NotificationsAPI extends dbUtils.KnexDataSource {
  async registerToken(
    ctx: context.UserContext,
    expo_token: string,
  ): Promise<gql.Token> {
    const user = await this.getCurrentUser(ctx);
    const existingToken = await dbUtils.unique(this.knex<Token>('expo_tokens').select('*').where({ expo_token }));
    if (existingToken) {
      const newToken = await dbUtils.unique(this.knex<Token>('expo_tokens').where({ id: existingToken.id }).update({ member_id: user?.member_id }).returning('*'));
      if (!newToken) {
        throw new ApolloError('token was removed unexpectedly');
      }
      return convertToken(newToken);
    }
    logger.info(`Added ${expo_token} to db.`);
    const token = (await this.knex<Token>('expo_tokens').insert({ expo_token, member_id: user?.member_id }).returning('*'))[0];
    return convertToken(token);
  }

  private async getTokenFromExpo(expo_token: string): Promise<gql.Maybe<Token>> {
    return dbUtils.unique(this.knex<Token>('expo_tokens').where({ expo_token }));
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
    ctx: context.UserContext,
  ): Promise<gql.Tag[]> {
    const user = await this.getCurrentUser(ctx);

    const tags: sql.Tag[] = (
      await this.knex<TagSubscription>('tag_subscriptions')
        .select('tags.*')
        .join('tags', 'tags.id', 'tag_subscriptions.tag_id')
        .where({ member_id: user.member_id }));
    return tags.map(convertTag);
  }

  async subscribeTags(
    ctx: context.UserContext,
    tag_ids: UUID[],
  ): Promise<UUID[]> {
    const user = await this.getCurrentUser(ctx);
    // Check if any are already subscribed to, then don't re-subsribe to them
    const existing = (await this.knex<TagSubscription>('tag_subscriptions').select('tag_id').where({ member_id: user.member_id }).whereIn('tag_id', tag_ids)).map((r) => r.tag_id);

    const newTags = tag_ids.filter((t) => existing.indexOf(t) === -1).map((tag_id) => ({
      member_id: user.member_id,
      tag_id,
    }));

    if (newTags.length > 0) {
      return (await this.knex<TagSubscription>('tag_subscriptions').insert(newTags).returning('id')).map((r) => r.id);
    }
    return [];
  }

  async unsubscribeTags(
    ctx: context.UserContext,
    tag_ids: UUID[],
  ): Promise<number> {
    const user = await this.getCurrentUser(ctx);
    // Get which ones are already subscribed to, only unsubscribe to those
    const existing = (await this.knex<TagSubscription>('tag_subscriptions').select('tag_id').where({ member_id: user.member_id }).whereIn('tag_id', tag_ids)).map((r) => r.tag_id);

    const deletedRowAmount = await this.knex<TagSubscription>('tag_subscriptions').where({
      member_id: user.member_id,
    }).whereIn('tag_id', tag_ids.filter((t) => existing.indexOf(t) !== -1)).del();
    return deletedRowAmount;
  }

  async getMyNotifications(
    ctx: context.UserContext,
  ): Promise<gql.Notification[]> {
    const user = await this.getCurrentUser(ctx);
    return (await this.knex<SQLNotification>('notifications')
      .where({ member_id: user.member_id })
      .orderBy('created_at', 'desc')).map(convertNotification);
  }

  async markAsRead(ctx: context.UserContext, notificationIds: UUID[]): Promise<gql.Notification[]> {
    const user = await this.getCurrentUser(ctx);
    const notifications = await this.knex<SQLNotification>('notifications')
      .where({ member_id: user.member_id })
      .whereIn('id', notificationIds)
      .whereNull('read_at')
      .update({ read_at: new Date() })
      .returning('*');
    return notifications.map(convertNotification);
  }

  async deleteNotifications(ctx: context.UserContext, notificationIds: UUID[]):
  Promise<gql.Notification[]> {
    const user = await this.getCurrentUser(ctx);
    const notifications = await this.knex<SQLNotification>('notifications')
      .where({ member_id: user.member_id })
      .whereIn('id', notificationIds);
    if (!notifications.length) throw new Error('No notifications found');
    await this.knex<SQLNotification>('notifications')
      .where({ member_id: user.member_id })
      .whereIn('id', notificationIds)
      .del();
    return this.getMyNotifications(ctx);
  }
}
