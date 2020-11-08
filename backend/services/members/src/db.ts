import { ForbiddenError } from 'apollo-server';
import { context, knex, dbUtils } from 'dsek-shared';

interface DbMember {
  id: number,
  student_id: string,
  first_name: string,
  nickname: string,
  last_name: string,
  class_programme: string,
  class_year: number,
  picture_path: string,
}

interface DbCommittee {
  id: number,
  name?: string,
  name_en?: string,
}

interface DbPosition {
  id: number,
  name?: string,
  name_en?: string,
  committee_id?: number,
}

const getMember = async (identifier: {student_id?: string, id?: number}): Promise<DbMember | undefined> => {
  if (!identifier.id && !identifier.student_id) {
    console.log('No indentifier given');
    return undefined;
  }
  return knex<DbMember>('members')
    .select('*')
    .where(identifier)
    .first()
    .catch((reason: any) => {
      return undefined
    })
}

interface PositionFilter {
  id?: number,
  name?: string,
  name_en?: string,
  committee_id?: number,
}

const getPositions = (filter?: PositionFilter) => {
  return knex<DbPosition>('positions').select('*').where(dbUtils.camelToSnake(filter))
}

interface CreatePosition {
  name: string,
  committeeId?: number,
}

interface UpdatePosition {
  name?: string,
  committeeId?: number,
}

const createPosition = ({user}: context.UserContext, input: CreatePosition) => {
  if (!user) throw new ForbiddenError('Operation denied');
  return knex('positions').insert(dbUtils.camelToSnake(input));
}

const updatePosition = async ({user}: context.UserContext, id: number, input: UpdatePosition) => {
  if (!user) throw new ForbiddenError('Operation denied');
  if (Object.keys(input).length === 0) return false;
  return knex('positions').where({id}).update(dbUtils.camelToSnake(input))
}

const removePosition = ({user}: context.UserContext, id: number) => {
  if (!user) throw new ForbiddenError('Operation denied');
  return knex('positions').where({id}).del()
}

interface CommitteeFilter {
  id?: number,
  name?: string,
  name_en?: string,
}

const getCommittees = (filter?: CommitteeFilter) => {
  return knex<DbCommittee>('committees').select('*').where(dbUtils.camelToSnake(filter))
}

interface CreateCommittee {
  name: string,
}

interface UpdateCommittee {
  name?: string,
}

const createCommittee = ({user}: context.UserContext, input: CreateCommittee) => {
  if (!user) throw new ForbiddenError('Operation denied');
  return knex('committees').insert(dbUtils.camelToSnake(input))
}

const updateCommittee = async ({user}: context.UserContext, id: number, input: UpdateCommittee) => {
  if (!user) throw new ForbiddenError('Operation denied');
  if (Object.keys(input).length === 0) return false;
  return knex('committee').where({id}).update(dbUtils.camelToSnake(input))
}

const removeCommittee = ({user}: context.UserContext, id: number) => {
  if (!user) throw new ForbiddenError('Operation denied');
  return knex('committee').where({id}).del()
}

export {
  DbMember,
  getMember,

  DbPosition,
  PositionFilter,
  getPositions,
  CreatePosition,
  createPosition,
  UpdatePosition,
  updatePosition,
  removePosition,

  DbCommittee,
  CommitteeFilter,
  getCommittees,
  CreateCommittee,
  createCommittee,
  UpdateCommittee,
  updateCommittee,
  removeCommittee,
}