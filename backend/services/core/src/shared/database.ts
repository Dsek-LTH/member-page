/* eslint-disable import/no-cycle */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ApolloError, UserInputError } from 'apollo-server';
import { InMemoryLRUCache, KeyValueCache } from 'apollo-server-caching';
import { ForbiddenError } from 'apollo-server-errors';
import { Knex, knex } from 'knex';
import { ILengthAwarePagination, attachPaginate } from 'knex-paginate';
import configs from '../../knexfile';
import { AdminSetting, Member } from '../types/database';
import { PaginationInfo } from '../types/graphql';
import { SQLNotification, SubscriptionSetting, Token } from '../types/notifications';
import { UserContext } from './context';
import sendPushNotifications from './pushNotifications';
import { slugify } from './utils';
import { NotificationSettingType, NotificationType, SUBSCRIPTION_SETTINGS_MAP } from './notifications';
import createLogger from './logger';

attachPaginate();
const notificationsLogger = createLogger('notifications');

const ONE_DAY_IN_SECONDS = 1000 * 60 * 60 * 24;

type Keycloak = {
  keycloak_id: string,
  member_id: UUID,
};

export const SETTING_KEYS = {
  stabHiddenStart: 'stab_hidden_start',
  stabHiddenEnd: 'stab_hidden_end',
};

export const STAB_IDS = ['dsek.noll.stab.mdlm', 'dsek.noll.stab.oph'];

const knexConfig = configs[process.env.NODE_ENV || 'development'];

export type UUID = string;

export type ApiAccessPolicy = {
  id: UUID,
  api_name: string,
  role?: string,
  student_id?: string,
};

export const unique = async <T>(promise: Promise<T[] | undefined>) => {
  const list = await promise;
  if (!list || list.length !== 1) return undefined;
  return list[0];
};

export const createPageInfoFromPagination = (pagination: ILengthAwarePagination):
PaginationInfo => ({
  totalItems: pagination.total,
  totalPages: pagination.lastPage,
  perPage: pagination.perPage,
  page: pagination.currentPage,
  hasNextPage: pagination.currentPage < pagination.lastPage,
  hasPreviousPage: pagination.currentPage > 1,
});

export const createPageInfo = (totalItems: number, page: number, perPage: number) => {
  const totalPages = Math.ceil(totalItems / perPage);

  const pageInfo = {
    totalPages,
    totalItems,
    page,
    perPage,
    hasNextPage: page + 1 < totalPages,
    hasPreviousPage: page > 0,
  };

  return pageInfo;
};

export const verifyAccess = (policies: ApiAccessPolicy[], context: UserContext): boolean => {
  const roles = context.roles ?? [];
  const studentId = context.user?.student_id ?? '';

  return policies.some((p) => {
    if (p.student_id === studentId) return true;
    if (p.role && roles.includes(p.role)) return true;
    if (p.role === '_' && context.user?.keycloak_id) return true;
    if (p.role === '*') return true;
    return false;
  });
};

export class KnexDataSource extends DataSource<UserContext> {
  protected knex: Knex;

  protected context?: UserContext;

  protected cache?: KeyValueCache;

  constructor(_knex: Knex) {
    super();
    this.knex = _knex;
  }

  initialize(config: DataSourceConfig<UserContext>) {
    this.context = config.context;
    this.cache = config.cache || new InMemoryLRUCache();
  }

  async getMemberFromKeycloakId(keycloak_id: string): Promise<Member> {
    const member: Member | undefined = await (this.knex('members')
      .select('members.*')
      .join('keycloak', { 'members.id': 'keycloak.member_id' })
      .where({ keycloak_id })
      .first());

    if (!member) throw new Error('Member not found');

    return member;
  }

  async getCurrentUser(ctx: UserContext): Promise<Keycloak> {
    if (!ctx.user?.keycloak_id) {
      throw new ApolloError('User not logged in');
    }
    const user = await this.knex<Keycloak>('keycloak').where({ keycloak_id: ctx.user.keycloak_id }).first();
    if (!user) throw new Error("User doesn't exist");
    return user;
  }

  async getCurrentMember(ctx: UserContext): Promise<Member> {
    if (!ctx.user?.student_id && !ctx.user?.keycloak_id) {
      throw new UserInputError('User not logged in');
    }
    let query = this.knex<Member>('members').select('members.*');
    if (ctx.user?.student_id) {
      query = query.andWhere({ student_id: ctx.user.student_id });
    } else {
      query = query
        .join('keycloak', { 'members.id': 'keycloak.member_id' })
        .andWhere({ keycloak_id: ctx.user.keycloak_id });
    }
    const member = await query.first();
    if (!member) {
      throw new UserInputError("Member doesn't exist");
    }
    return member;
  }

  async slugify(table: string, str: string) {
    const slug = slugify(str);
    let count = 1;
    // make sure slug is unique
    // eslint-disable-next-line no-await-in-loop
    while (await this.knex(table).where({ slug: `${slug}-${count}` }).first()) {
      count += 1;
    }
    return `${slug}-${count}`;
  }

  RECEIVE_DUPLICATES = [
    NotificationType.CREATE_MANDATE,
    NotificationType.ARTICLE_UPDATE,
    NotificationType.BOOKING_REQUEST,
  ];

  /**
   *
   * @param title
   * @param message
   * @param type
   * @param memberIds if no memberId is input then it will send to all users
   */
  async addNotification({
    title,
    message,
    type,
    link,
    memberIds,
    fromMemberId,
  }: {
    title: string,
    message: string,
    type: NotificationType,
    link: string,
    memberIds?: UUID[],
    fromMemberId?: UUID,
  }) {
    // Find corresponding setting type "COMMENT" for "EVENT_COMMENT"
    const settingType: NotificationSettingType = (Object.entries(SUBSCRIPTION_SETTINGS_MAP)
      .find(([_, internalTypes]) => internalTypes.includes(type))?.[0]
      ?? type) as NotificationSettingType;
    let subscribedMembersQuery = this.knex<SubscriptionSetting>('subscription_settings')
      .select('subscription_settings.member_id', 'subscription_settings.push_notification')
      .join('members', 'members.id', '=', 'subscription_settings.member_id')
      .where({ type: settingType })
      .andWhereNot({ member_id: fromMemberId });
    if (memberIds !== undefined && memberIds.length > 0) {
      subscribedMembersQuery = subscribedMembersQuery.whereIn('subscription_settings.member_id', memberIds);
    }
    // Filter out members to be the only ones which actually subscribe to the type of notification
    const subscribedMembers = (await subscribedMembersQuery)
      .map((s) => ({ id: s.member_id, pushNotification: s.push_notification }));

    const shouldReceiveDuplicates = this.RECEIVE_DUPLICATES.includes(type);
    // Duplicates are only same type of action, on same entity, from the same user. Examples:
    // Same person liking your article twice. Same person commenting on your article 4 times. etc
    const membersWithPreviousNotification = shouldReceiveDuplicates ? []
      : (await this.knex<SQLNotification>('notifications')
        .select('member_id')
        .whereIn('member_id', subscribedMembers.map((s) => s.id))
        .andWhere({ type, link, from_member_id: fromMemberId })
        .distinct('member_id')).map((n) => n.member_id);

    const nonDuplicateMembers = subscribedMembers.filter((s) =>
      !membersWithPreviousNotification.includes(s.id));
    if (nonDuplicateMembers.length === 0) return;
    notificationsLogger.info(`Sending ${type} notification to ${nonDuplicateMembers.length} members, sent from member:${fromMemberId}`);

    const pushNotificationMembers = nonDuplicateMembers
      .filter((s) => s.pushNotification).map((s) => s.id);

    // Get pushTokens for members which have pushNotification enabled
    // in their subscription setting for the type
    const pushTokens: string[] = (
      await this.knex<Token>('expo_tokens')
        .select('expo_token')
        .whereIn('expo_tokens.member_id', pushNotificationMembers)
    ).map((t) => t.expo_token);
    sendPushNotifications(pushTokens, title, message, settingType, link);

    const notifications = nonDuplicateMembers.map(({ id: memberId }) => ({
      title,
      message,
      type,
      link,
      member_id: memberId,
      from_member_id: fromMemberId,
    }));
    if (notifications.length === 0) return;
    await this.knex<SQLNotification>('notifications').insert(notifications).returning('*');
  }

  async useCache(query: Knex.QueryBuilder, ttl: number = 5) {
    if (!this.cache) return query;
    const cacheKey = query.toString();
    const entry = await this.cache.get(cacheKey);
    if (entry) return JSON.parse(entry);

    const rows = await query;
    if (rows) this.cache.set(cacheKey, JSON.stringify(rows), { ttl });
    return rows;
  }

  async withAccess<T>(
    apiName: string | string[],
    context: UserContext,
    fn: () => Promise<T>,
    myMemberId?: string,
  ) {
    const apiNames = (typeof apiName === 'string') ? [apiName] : apiName;
    const policies = await this.knex<ApiAccessPolicy>('api_access_policies').whereIn('api_name', apiNames);
    // Check if logged in user actually owns the referenced id
    if (myMemberId && context.user?.keycloak_id) {
      const member = await this.getMemberFromKeycloakId(context.user?.keycloak_id);
      if (myMemberId === member.id) return fn();
    }
    if (verifyAccess(policies, context)) return fn();
    throw new ForbiddenError('You do not have permission, have you logged in?');
  }

  async hasAccess(
    apiName: string | string[],
    context: UserContext,
    myMemberId?: string,
  ): Promise<boolean> {
    const apiNames = (typeof apiName === 'string') ? [apiName] : apiName;
    const policies = await this.knex<ApiAccessPolicy>('api_access_policies').whereIn('api_name', apiNames);
    // Check if logged in user actually owns the referenced id
    if (myMemberId && context.user?.keycloak_id) {
      const member = await this.getMemberFromKeycloakId(context.user?.keycloak_id);
      if (myMemberId === member.id) return true;
    }
    if (verifyAccess(policies, context)) return true;
    return false;
  }

  async getNollningTagId(): Promise<UUID | undefined> {
    const tag = await this.knex('tags')
      .where({ name: 'Nollning' })
      .first();
    return tag?.id;
  }

  // used to cache the stab hidden setting
  private stabHidden = false;

  /**
   * last time stab hidden setting was checked in milliseconds
   */
  private lastStabHiddenCheck = 0;

  private async checkStabHiddenSetting() {
    const startPromise = await this.knex<AdminSetting>('admin_settings').select('*').where({ key: SETTING_KEYS.stabHiddenStart }).first();
    const endPromise = await this.knex<AdminSetting>('admin_settings').select('*').where({ key: SETTING_KEYS.stabHiddenEnd }).first();
    const [start, end] = await Promise.all([startPromise, endPromise]);
    if (!start || !end) {
      this.stabHidden = false;
      this.lastStabHiddenCheck = Date.now();
      return;
    }
    const now = new Date();
    const startHidden = new Date(start.value);
    const endHidden = new Date(end.value);
    this.stabHidden = now > startHidden && now < endHidden;
    this.lastStabHiddenCheck = Date.now();
  }

  async updateStabHidden() {
    this.checkStabHiddenSetting();
  }

  /**
   * Checks admin settings if stab_hidden period is active now
   * @returns true if stab should be hidden
   */
  async isStabHidden() {
    // check max once per day if stab is hidden
    const now = Date.now();
    if (now - this.lastStabHiddenCheck > ONE_DAY_IN_SECONDS * 1000) {
      await this.checkStabHiddenSetting();
    }
    return this.stabHidden;
  }

  /**
   * Checks admin settings if stab is currently hidden.
   * Admin users can see stab even if it is hidden.
   * User's can always see themselves.
   * @param ctx Context for logged in user
   * @param memberId Relevant memberId of the member which might be hidden, if applicable
   * @returns true if should be hidden
   */
  async isStabHiddenForUser(ctx: UserContext, memberId?: string) {
    if (!(await this.isStabHidden())) {
      return false;
    }
    if (await this.hasAccess(['nolla:admin', 'nolla:see_stab', 'admin:settings:update', 'core:admin'], ctx, memberId)) {
      return false;
    }
    return true;
  }
}

export default knex(knexConfig);
