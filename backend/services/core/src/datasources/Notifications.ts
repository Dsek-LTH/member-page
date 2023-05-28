import { ApolloError } from 'apollo-server';
import
{
  ApiAccessPolicy,
  context, createLogger, dbUtils, UUID,
} from '../shared';
import { convertNotification } from '../shared/converters';
import { verifyAccess } from '../shared/database';
import { DEFAULT_SUBSCRIPTION_SETTINGS, NotificationSettingType, NotificationType } from '../shared/notifications';
import { Member } from '../types/database';
import type * as gql from '../types/graphql';
import type * as sql from '../types/news';
import type {
  SQLNotification, SubscriptionSetting,
  TagSubscription,
  Token,
} from '../types/notifications';
import { convertTag } from './News';
import { convertMember, getFullName } from './Member';

const logger = createLogger('notifications');

/**
 * Provides a title and description for every subscription setting.
 */
const SUBSCRIPTION_TYPES: Record<NotificationSettingType, Omit<gql.SubscriptionType, 'type'>> = {
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
  return { ...SUBSCRIPTION_TYPES[type as NotificationSettingType], type };
}

type NotificationWithMember = SQLNotification & {
  member: Member;
};

function getMessage(
  mostRecentNotification: NotificationWithMember,
  group: NotificationWithMember[],
  suffix: string,
) {
  const secondMember: Member | undefined = group[1]?.member;
  if (!mostRecentNotification.member.first_name || !mostRecentNotification.member.last_name
  || !secondMember?.first_name || !secondMember?.last_name) {
    return `${group.length} personer ${suffix}`;
  }
  return (group.length > 2
    ? `${getFullName(mostRecentNotification)} och ${group.length - 1} andra ${suffix}`
    : `${getFullName(mostRecentNotification)} och ${getFullName(secondMember)} ${suffix}`);
}

function mergeNotifications(group: NotificationWithMember[], ctx: context.UserContext):
gql.Notification[] | gql.Notification {
  const convert = (notification: NotificationWithMember, ids?: string[]) =>
    convertNotification(notification, convertMember(notification.member, ctx), ids);
  if (group.length === 1) {
    return group.map((n) => convert(n));
  }
  const mostRecentNotification = group[0]; // Assume group is ordered
  const type = mostRecentNotification.type as NotificationType;
  switch (type) {
    case NotificationType.LIKE:
      return convert({
        ...mostRecentNotification,
        title: mostRecentNotification.title, // is the article header
        message: getMessage(mostRecentNotification, group, 'har gillat din nyhet'),
      }, group.map((n) => n.id));
    case NotificationType.EVENT_LIKE: // THIS IS NOT USED, yet...
      return convert({
        ...mostRecentNotification,
        title: mostRecentNotification.title, // is the event title
        message: getMessage(mostRecentNotification, group, 'har gillat ditt evenemang'),
      }, group.map((n) => n.id));
    case NotificationType.COMMENT:
      return convert({
        ...mostRecentNotification,
        title: getMessage(mostRecentNotification, group, 'har kommentaret på din nyhet'),
        message: mostRecentNotification.message, // is the content of the last comment
      }, group.map((n) => n.id));
    case NotificationType.EVENT_COMMENT:
      return convert({
        ...mostRecentNotification,
        title: getMessage(mostRecentNotification, group, 'har kommentaret på ditt evenemang'), // for explicity
        message: mostRecentNotification.message, // is the content of the last comment
      }, group.map((n) => n.id));
    case NotificationType.MENTION:
      return convert({
        ...mostRecentNotification,
        title: getMessage(mostRecentNotification, group, 'har nämnt dig i kommentarer'),
        message: mostRecentNotification.message, // is the content of the last comment
      }, group.map((n) => n.id));
    case NotificationType.EVENT_GOING:
      return convert({
        ...mostRecentNotification,
        title: mostRecentNotification.title, // title of the event
        message: getMessage(mostRecentNotification, group, 'kommer'),
      }, group.map((n) => n.id));
    case NotificationType.EVENT_INTERESTED:
      return convert({
        ...mostRecentNotification,
        title: mostRecentNotification.title, // title of the event
        message: getMessage(mostRecentNotification, group, 'är intresserade'),
      }, group.map((n) => n.id));
    case NotificationType.PING:
      return convert({
        ...mostRecentNotification,
        title: mostRecentNotification.title, // says PING!
        message: getMessage(mostRecentNotification, group, 'har pingat dig'),
      }, group.map((n) => n.id));
    // To clarify these have not been forgotten are meant to not be merged
    case NotificationType.ARTICLE_UPDATE:
    case NotificationType.BOOKING_REQUEST:
    case NotificationType.CREATE_MANDATE:
    case NotificationType.NEW_ARTICLE:
    default:
      return group.map((n) => convert(n));
  }
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
    const allNotifications = (await this.knex<SQLNotification>('notifications')
      .select('notifications.*', 'to_json(members.*) as member') // need to specify id specifically so it doesn't choose members.id as id
      .where({ member_id: member.id })
      .leftJoin<Member>('members', 'members.id', 'notifications.from_member_id')
      .orderBy('created_at', 'desc')) as NotificationWithMember[];
    // Group notifications on link and type
    const groupedNotifications = allNotifications.reduce((acc, notification) => {
      const { link, type } = notification;
      const key = `${type}:${link}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(notification);
      return acc;
    }, {} as Record<string, typeof allNotifications>);
    // Merge notifications
    const mergedNotifications = Object.values(groupedNotifications)
      .flatMap((n) => mergeNotifications(n, ctx))
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });
    return mergedNotifications;
  }

  async markAsRead(ctx: context.UserContext, notificationIds: UUID[]): Promise<gql.Notification[]> {
    const member = await this.getCurrentMember(ctx);
    const notifications = await this.knex<SQLNotification>('notifications')
      .where({ member_id: member.id })
      .whereIn('id', notificationIds)
      .whereNull('read_at')
      .update({ read_at: new Date() })
      .returning('*');
    return notifications.map((n) => convertNotification(n));
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
