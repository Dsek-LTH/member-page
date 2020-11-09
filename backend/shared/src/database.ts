import knex from 'knex';
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

export default knex(config);