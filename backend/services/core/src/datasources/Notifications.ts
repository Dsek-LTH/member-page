import { ApolloError } from 'apollo-server';
import { verifyAccess } from '../shared/database';
import
{
  ApiAccessPolicy,
  context, createLogger, dbUtils, UUID,
} from '../shared';
import { convertNotification } from '../shared/converters';
import * as gql from '../types/graphql';
import * as sql from '../types/news';
import {
  Token, TagSubscription, SQLNotification, SubscriptionSetting,
} from '../types/notifications';
import { convertTag } from './News';

const logger = createLogger('notifications');
export const DEFAULT_SUBSCRIPTION_SETTINGS: {
  type: string,
  push_notification: boolean,
}[] = [
  {
    type: 'LIKE',
    push_notification: false,
  },
  {
    type: 'COMMENT',
    push_notification: true,
  },
  {
    type: 'MENTION',
    push_notification: true,
  },
  {
    type: 'NEW_ARTICLE',
    push_notification: true,
  },
  {
    type: 'CREATE_MANDATE',
    push_notification: true,
  },
  {
    type: 'BOOKING_REQUEST',
    push_notification: true,
  },
  {
    type: 'PING',
    push_notification: false,
  },
];

/**
 * Maps subscription settings to internal notification types.
 * A subscription setting controls said notification types.
 */
export const SUBSCRIPTION_SETTINGS_MAP: Record<keyof typeof SUBSCRIPTION_TYPES, string[]> = {
  LIKE: ['LIKE', 'EVENT_LIKE'],
  // I think using "COMMENT" for ARTICLE_UPDATE makes sense.
  // We don't want to overwhelm user with TOO many notification options, and I feel like
  // the same demographic want notifications for comments and approvements.
  COMMENT: ['COMMENT', 'EVENT_COMMENT', 'ARTICLE_UPDATE'],
  MENTION: ['MENTION'],
  NEW_ARTICLE: ['NEW_ARTICLE'],
  EVENT_GOING: ['EVENT_GOING', 'EVENT_INTERESTED'],
  CREATE_MANDATE: ['CREATE_MANDATE'],
  BOOKING_REQUEST: ['BOOKING_REQUEST'],
  PING: ['PING'],
};

/**
 * Provides a title and description for every subscription setting.
 */
const SUBSCRIPTION_TYPES: Record<gql.SubscriptionType['type'], Omit<gql.SubscriptionType, 'type'> > = {
  LIKE: {
    title: 'Gillarmarkeringar på dina inlägg',
    titleEn: 'Likes on your posts',
    description: 'Få ett notis när någon gillar en nyhet eller evenemang du skapat',
    descriptionEn: 'Get a notification when someone likes an article or event you published',
  },
  COMMENT: {
    title: 'Kommentarer och uppdateringar på dina inlägg',
    titleEn: 'Comments and updates on your posts',
    description: 'Få ett notis när någon kommenterar på en nyhet eller evenemang du skapat, samt när någon godkänner/nekar en nyhet du har försökt publicera',
    descriptionEn: 'Get a notification when someone comments on an article or event you published, as well as when someone approves/rejects an article you have requested to publish',
  },
  MENTION: {
    title: 'När du blir nämnd',
    titleEn: 'When you are mentioned',
    description: 'Få ett notis när någon nämner dig',
    descriptionEn: 'Get a notification when someone mentions you',
  },
  NEW_ARTICLE: {
    title: 'Nyhetsprenumerationer',
    titleEn: 'News subscriptions',
    description: 'Få ett notis när det publiceras en nyhet med en tagg som du följer',
    descriptionEn: 'Get a notification when an article with a tag you follow is published',
  },
  EVENT_GOING: {
    title: 'Interaktioner på ditt event',
    titleEn: 'Interactions on your event',
    description: 'Få ett notis när någon vill gå på eller är intresserad av ett event du skapat',
    descriptionEn: 'Get a notification when someone wants to go to or is interesed in an event you published',
  },
  CREATE_MANDATE: {
    title: 'När du får en ny post',
    titleEn: 'When you get a new post',
    description: 'Få ett notis när du får en ny funktionärspost',
    descriptionEn: 'Get a notification when you get a new volunteer position',
  },
  BOOKING_REQUEST: {
    title: 'Bokningar',
    titleEn: 'Bookings',
    description: 'Få notiser gällande dina bokningar',
    descriptionEn: 'Get notifications related to your bookings',
  },
  PING: {
    title: 'Pingar',
    titleEn: 'Pings',
    description: 'Få en notis när någon pingar dig',
    descriptionEn: 'Get a notification when someone pings you',
  },
};

export function convertToken(token: Token) {
  const { member_id: memberId, ...rest } = token;
  const convertedToken: gql.Token = {
    ...rest,
    memberId,
  };
  return convertedToken;
}

export function convertType(type: string) {
  if (!(type in SUBSCRIPTION_TYPES)) {
    return {
      type: 'UNKNOWN',
      title: 'Okänd notistyp',
      titleEn: 'Unknown notification type',
      description: 'Okänd notistyp',
      descriptionEn: 'Unknown notification type',
    };
  }
  return { ...SUBSCRIPTION_TYPES[type], type };
}

export default class NotificationsAPI extends dbUtils.KnexDataSource {
  async registerToken(
    ctx: context.UserContext,
    expo_token: string,
  ): Promise<gql.Token> {
    const member = await this.getCurrentMember(ctx);
    const existingToken = await dbUtils.unique(this.knex<Token>('expo_tokens').select('*').where({ expo_token }));
    if (existingToken) {
      const newToken = await dbUtils.unique(this.knex<Token>('expo_tokens').where({ id: existingToken.id }).update({ member_id: member.id }).returning('*'));
      if (!newToken) {
        throw new ApolloError('token was removed unexpectedly');
      }
      return convertToken(newToken);
    }
    logger.info(`Added ${expo_token} to db.`);
    const token = (await this.knex<Token>('expo_tokens').insert({ expo_token, member_id: member.id }).returning('*'))[0];
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
    const member = await this.getCurrentMember(ctx);

    const tags: sql.Tag[] = (
      await this.knex<TagSubscription>('tag_subscriptions')
        .select('tags.*')
        .join('tags', 'tags.id', 'tag_subscriptions.tag_id')
        .where({ member_id: member.id }));
    return tags.map(convertTag);
  }

  async subscribeTags(
    ctx: context.UserContext,
    tag_ids: UUID[],
  ): Promise<UUID[]> {
    const member = await this.getCurrentMember(ctx);
    // Check if any are already subscribed to, then don't re-subsribe to them
    const existing = (await this.knex<TagSubscription>('tag_subscriptions').select('tag_id').where({ member_id: member.id }).whereIn('tag_id', tag_ids)).map((r) => r.tag_id);

    const newTags = tag_ids.filter((t) => existing.indexOf(t) === -1).map((tag_id) => ({
      member_id: member.id,
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
    const member = await this.getCurrentMember(ctx);
    // Get which ones are already subscribed to, only unsubscribe to those
    const existing = (await this.knex<TagSubscription>('tag_subscriptions').select('tag_id').where({ member_id: member.id }).whereIn('tag_id', tag_ids)).map((r) => r.tag_id);

    const deletedRowAmount = await this.knex<TagSubscription>('tag_subscriptions').where({
      member_id: member.id,
    }).whereIn('tag_id', tag_ids.filter((t) => existing.indexOf(t) !== -1)).del();
    return deletedRowAmount;
  }

  async getMyNotifications(
    ctx: context.UserContext,
  ): Promise<gql.Notification[]> {
    const member = await this.getCurrentMember(ctx);
    if (!member) {
      return [];
    }
    return (await this.knex<SQLNotification>('notifications')
      .where({ member_id: member.id })
      .orderBy('created_at', 'desc')).map(convertNotification);
  }

  async markAsRead(ctx: context.UserContext, notificationIds: UUID[]): Promise<gql.Notification[]> {
    const member = await this.getCurrentMember(ctx);
    const notifications = await this.knex<SQLNotification>('notifications')
      .where({ member_id: member.id })
      .whereIn('id', notificationIds)
      .whereNull('read_at')
      .update({ read_at: new Date() })
      .returning('*');
    return notifications.map(convertNotification);
  }

  async deleteNotifications(ctx: context.UserContext, notificationIds: UUID[]):
  Promise<gql.Notification[]> {
    const member = await this.getCurrentMember(ctx);
    const notifications = await this.knex<SQLNotification>('notifications')
      .where({ member_id: member.id })
      .whereIn('id', notificationIds);
    if (!notifications.length) throw new Error('No notifications found');
    await this.knex<SQLNotification>('notifications')
      .where({ member_id: member.id })
      .whereIn('id', notificationIds)
      .del();
    return this.getMyNotifications(ctx);
  }

  async getSubscriptionSettings(ctx: context.UserContext): Promise<gql.SubscriptionSetting[]> {
    const member = await this.getCurrentMember(ctx);
    const settingsRaw = await this.knex<SubscriptionSetting>('subscription_settings').where({ member_id: member.id });

    const policies = await this.knex<ApiAccessPolicy>('api_access_policies').where({ api_name: 'booking_request:create' });

    const settings: gql.SubscriptionSetting[] = settingsRaw
      .map((s) => {
        if (verifyAccess(policies, ctx)) {
          return ({
            id: s.id,
            type: convertType(s.type),
            pushNotification: s.push_notification,
          });
        }
        return null;
      }).filter((s) => s !== null) as gql.SubscriptionSetting[];
    return settings;
  }

  async addDefaultSettings(memberId: string): Promise<void> {
    const existingSettingsPromise = this.knex<SubscriptionSetting>('subscription_settings').where({ member_id: memberId });
    const existingSubscriptionsPromise = this.knex<TagSubscription>('tag_subscriptions').where({ member_id: memberId });
    const [existingSettings, existingSubscriptions] = await Promise.all(
      [existingSettingsPromise, existingSubscriptionsPromise],
    );
    if (existingSettings.length > 0 || existingSubscriptions.length > 0) {
      return;
    }

    const promise1 = this.knex<SubscriptionSetting>('subscription_settings').insert(DEFAULT_SUBSCRIPTION_SETTINGS.map((setting) => ({
      ...setting,
      member_id: memberId,
    })));
    const defaultTagIds = (await this.knex<sql.Tag>('tags').where({ is_default: true })).map((t) => t.id);
    const promise2 = this.knex<TagSubscription>('tag_subscriptions').insert(defaultTagIds.map((tag) => ({
      member_id: memberId,
      tag_id: tag,
    })));
    await Promise.all([promise1, promise2]);
  }

  async updateSubscriptionSettings(
    ctx: context.UserContext,
    type: string,
    enabled: boolean,
    pushNotification?: boolean,
  ): Promise<gql.SubscriptionSetting | undefined> {
    const member = await this.getCurrentMember(ctx);
    const existingSetting = await dbUtils.unique(this.knex<SubscriptionSetting>('subscription_settings').where({ member_id: member.id, type }));
    // It doesn't exist, and it shouldn't exist, then do nothing
    if (!existingSetting && !enabled) {
      return undefined;
    }
    if (existingSetting && !enabled) {
      await this.knex<SubscriptionSetting>('subscription_settings').where({ id: existingSetting.id }).del();
      return undefined;
    }
    // It does exist, and it should exist, then just update pushNotification
    if (existingSetting) {
      await this.knex<SubscriptionSetting>('subscription_settings').where({ id: existingSetting.id }).update({
        push_notification: pushNotification ?? false,
      });
      return {
        id: existingSetting.id,
        type: convertType(type),
        pushNotification: pushNotification ?? false,
      };
    }
    // It doesn't exist, and it should exist, then create it
    const newSetting = await this.knex<SubscriptionSetting>('subscription_settings').insert({
      member_id: member.id,
      type,
      push_notification: pushNotification ?? false,
    }).returning('*');
    return {
      id: newSetting[0].id,
      type: convertType(newSetting[0].type),
      pushNotification: newSetting[0].push_notification,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getSubscriptionTypes(): gql.SubscriptionType[] {
    return Object.entries(SUBSCRIPTION_TYPES).map(([type, rest]) => ({
      type,
      ...rest,
    }));
  }
}
