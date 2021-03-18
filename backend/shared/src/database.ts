import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { InMemoryLRUCache, KeyValueCache } from 'apollo-server-caching';
import Knex from 'knex';
import { UserContext } from './context';
import configs from './knexfile';

const config = configs[process.env.NODE_ENV || 'development'];

export const unique = async <T>(promise: Promise<T[] | undefined>) => {
  const list = await promise;
  if (!list || list.length != 1) return undefined;
  return list[0];
}

export const camelToSnake = (obj?: {[index: string]: any}) => {
  if (!obj) return {};
  const convertKey = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  return Object.keys(obj).reduce((prev, key) => ({...prev, [convertKey(key)]: obj[key]}), {})
}

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

  async useCache(query: Knex.QueryBuilder, ttl: number = 5) {
    if (!this.cache) return query;
    const cacheKey = query.toString();
    const entry = await this.cache.get(cacheKey);
    if (entry) return JSON.parse(entry);

    const rows = await query;
    if (rows) this.cache.set(cacheKey, JSON.stringify(rows), {ttl});
    return rows;
  }
}

export default Knex(config);