import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { InMemoryLRUCache, KeyValueCache } from 'apollo-server-caching';
import { ForbiddenError } from 'apollo-server-errors';
import { knex, Knex } from 'knex';
import { UserContext } from './context';
import configs from '../../knexfile';
import { slugify } from './utils';
// eslint-disable-next-line import/no-cycle
import { SQLNotification } from '../types/notifications';

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

  getMemberFromKeycloakId(keycloak_id: string) {
    return this.knex('members')
      .select('members.*')
      .join('keycloak', { 'members.id': 'keycloak.member_id' })
      .where({ keycloak_id })
      .first();
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
    const notifications = membersToSendTo.map((memberId) => ({
      title,
      message,
      type,
      link,
      member_id: memberId,
    }));
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
    throw new ForbiddenError('You do not have permission.');
  }
}

export default knex(knexConfig);
