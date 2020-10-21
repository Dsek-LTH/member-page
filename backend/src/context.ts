import knex from './database';
import express from 'express';

import { dateToString } from './datetime';

interface User {
  keycloak_id: string,
  stil_id?: string,
  name?: string,
}

interface Role {
  position_title: string,
  committee_name: string,
}

interface UserContext {
  user: User,
  roles: Role[],
}

const deserializeContext = ({req}: {req: express.Request}): UserContext | undefined => {
  try {
    const user = (req.headers['x-user']) ? JSON.parse(JSON.stringify(req.headers['x-user'])) : undefined;
    const roles = (req.headers['x-roles']) ? JSON.parse(JSON.stringify(req.headers['x-roles'])) : undefined;
    return {user: user, roles: roles};
  } catch (e) {
    return undefined;
  }
}

const getRoles = async (stil_id?: string): Promise<Role[]> => {
  if (!stil_id) return [];
  const currentDate = dateToString(new Date());
  return await knex<Role>('mandates')
    .join('positions', 'mandates.position_title', 'positions.position_title')
    .select('positions.position_title','positions.committee_name')
    .where('stil_id', stil_id)
    .where('start_date', '<=', currentDate)
    .where('end_date', '>=', currentDate)
    .catch((reason: any) => {
      return []
    })
}

export {
  User,
  Role,
  UserContext,
  deserializeContext,
  getRoles,
}