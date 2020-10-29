import knex from './database';

import { dateToString } from './datetime';

interface User {
  keycloak_id: string,
  student_id?: string,
  name?: string,
}

interface Position {
  position_id: number,
  committee_id: number,
};

interface UserContext {
  user: User,
  roles: Position[],
}

interface ContextRequest {
  headers: {
    'x-user': string,
    'x-roles': string,
  }
}

const deserializeContext = ({req}: {req: ContextRequest}): UserContext | undefined => {
  try {
    const user = (req.headers['x-user']) ? JSON.parse(req.headers['x-user']) : undefined;
    const roles = (req.headers['x-roles']) ? JSON.parse(req.headers['x-roles']) : undefined;
    return {user: user, roles: roles};
  } catch (e) {
    return undefined;
  }
}

const getRoles = async (student_id?: string): Promise<Position[]> => {
  if (!student_id) return [];
  const currentDate = dateToString(new Date());
  return knex<Position>('mandates')
    .join('members', 'members.id', 'mandates.member_id')
    .join('positions', 'positions.id', 'mandates.position_id')
    .select('position_id', 'committee_id')
    .where('student_id', student_id)
    .where('start_date', '<=', currentDate)
    .where('end_date', '>=', currentDate)
    .catch((reason: any) => {
      return []
    })
}

export {
  User,
  Position,
  UserContext,
  deserializeContext,
  getRoles,
}