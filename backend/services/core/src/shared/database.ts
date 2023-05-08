/* eslint-disable import/no-cycle */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ApolloError } from 'apollo-server';
import { InMemoryLRUCache, KeyValueCache } from 'apollo-server-caching';
import { ForbiddenError } from 'apollo-server-errors';
import { knex, Knex } from 'knex';
import { attachPaginate, ILengthAwarePagination } from 'knex-paginate';
import configs from '../../knexfile';
import { Member } from '../types/database';
import { PaginationInfo } from '../types/graphql';
import { SQLNotification, SubscriptionSetting, Token } from '../types/notifications';
import { UserContext } from './context';
import sendPushNotifications from './pushNotifications';
import { slugify } from './utils';

attachPaginate();

type Keycloak = {
  keycloak_id: string,
  member_id: UUID,
};

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
  }: {
    title: string,
    message: string,
    type: string,
    link: string,
    memberIds?: UUID[],
  }) {
    let membersToSendTo: UUID[] = [];
    if (memberIds) {
      membersToSendTo = memberIds;
    } else {
      const members = await this.knex<Keycloak>('keycloak').select('member_id');
      membersToSendTo = members.map((m) => m.member_id);
    }
    // Filter out members to be the only ones which actually subscribe to the type of notification
    const subscribedMembers = (await this.knex<SubscriptionSetting>('subscription_settings')
      .select('member_id', 'push_notification')
      .whereIn('member_id', membersToSendTo)
      .andWhere({ type }))
      .map((s) => ({ id: s.member_id, pushNotification: s.push_notification }));

    const pushNotificationMembers = subscribedMembers
      .filter((s) => s.pushNotification).map((s) => s.id);

    // Get pushTokens for members which have pushNotification enabled
    // in their subscription setting for the type
    const pushTokens: string[] = (
      await this.knex<Token>('expo_tokens')
        .select('expo_token')
        .whereIn('expo_tokens.member_id', pushNotificationMembers)
    ).map((t) => t.expo_token);
    sendPushNotifications(pushTokens, title, message, type, link);

    const notifications = subscribedMembers.map(({ id: memberId }) => ({
      title,
      message,
      type,
      link,
      member_id: memberId,
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
}

export default knex(knexConfig);
