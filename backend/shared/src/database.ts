import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { InMemoryLRUCache, KeyValueCache } from 'apollo-server-caching';
import { ForbiddenError } from 'apollo-server-errors';
import Knex from 'knex';
import { UserContext } from './context';
import configs from './knexfile';

const knexConfig = configs[process.env.NODE_ENV || 'development'];

export type UUID = string;

export type ApiAccessPolicy = {
  id: UUID,
  api_name: string,
  role?: string,
  student_id?: string,
}

export const unique = async <T>(promise: Promise<T[] | undefined>) => {
  const list = await promise;
  if (!list || list.length !== 1) return undefined;
  return list[0];
};

export const camelToSnake = (obj?: {[index: string]: any}) => {
  if (!obj) return {};
  const convertKey = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  return Object.keys(obj).reduce((prev, key) => ({ ...prev, [convertKey(key)]: obj[key] }), {});
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

  constructor(knex: Knex) {
    super();
    this.knex = knex;
  }

  initialize(config: DataSourceConfig<UserContext>) {
    this.context = config.context;
    this.cache = config.cache || new InMemoryLRUCache();
  }

  getMemberIdFromKeycloakId(keycloak_id: string): Promise<UUID | undefined> {
    return unique(this.knex('members')
      .select('members.id')
      .join('keycloak', { 'members.id': 'keycloak.member_id' })
      .where({ keycloak_id }))
      .then((m) => m.id);
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
    resourceUserId?: string,
  ) {
    const apiNames = (typeof apiName === 'string') ? [apiName] : apiName;
    const policies = await this.knex<ApiAccessPolicy>('api_access_policies').whereIn('api_name', apiNames);
    if (resourceUserId) {
      const signedInUserId = await this.getMemberIdFromKeycloakId(resourceUserId);
      if (resourceUserId === signedInUserId) return fn();
    }
    if (verifyAccess(policies, context)) return fn();
    throw new ForbiddenError('You do not have permission.');
  }
}

export default Knex(knexConfig);
