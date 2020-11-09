import { ForbiddenError } from 'apollo-server';
import { context, knex, dbUtils } from 'dsek-shared';

import * as gql from './types/graphql';
import * as sql from './types/mysql';

export const getMember = (identifier: {student_id?: string, id?: number}): Promise<gql.Maybe<gql.Member>> => {
  return dbUtils.unique(knex<sql.DbMember>('members').select('*').where(identifier));
}

export const getAllPositions = (): Promise<gql.Position[]> => {
  return knex<sql.DbPosition>('positions').select('*');
}

export const getPosition = (identifier: gql.PositionFilter): Promise<gql.Maybe<gql.Position>> => {
  return dbUtils.unique(getPositions(identifier));
}

export const getPositions = (filter: gql.PositionFilter): Promise<gql.Position[]> => {
  return knex<sql.DbPosition>('positions').select('*').where(filter)
}

export const createPosition = ({user}: context.UserContext, input: sql.DbCreatePosition) => {
  if (!user) throw new ForbiddenError('Operation denied');
  return knex('positions').insert(input);
}

export const updatePosition = async ({user}: context.UserContext, id: number, input: sql.DbUpdatePosition) => {
  if (!user) throw new ForbiddenError('Operation denied');
  if (Object.keys(input).length === 0) return false;
  return knex('positions').where({id}).update(input)
}

export const removePosition = ({user}: context.UserContext, id: number) => {
  if (!user) throw new ForbiddenError('Operation denied');
  return knex('positions').where({id}).del()
}

export const getAllCommittees = (): Promise<gql.Committee[]> => {
  return knex<sql.DbCommittee>('commitees').select('*');
}

export const getCommittee = (identifier: gql.CommitteeFilter): Promise<gql.Maybe<gql.Committee>> => {
  return dbUtils.unique(getCommittees(identifier));
}

export const getCommitteeFromPositionId = (position_id: gql.Scalars['Int']): Promise<gql.Maybe<gql.Committee>> => {
  return dbUtils.unique(
    knex<sql.DbCommittee>('positions')
    .select('committees.*')
    .join('committees', {'positions.committee_id': 'committees.id'})
    .where({'positions.id': position_id})
  );
}

export const getCommittees = (filter: gql.CommitteeFilter): Promise<gql.Committee[]> => {
  return knex<sql.DbCommittee>('committees').select('*').where(filter)
}

export const createCommittee = ({user}: context.UserContext, input: sql.DbCreateCommittee) => {
  if (!user) throw new ForbiddenError('Operation denied');
  return knex('committees').insert(input)
}

export const updateCommittee = async ({user}: context.UserContext, id: number, input: sql.DbUpdateCommittee) => {
  if (!user) throw new ForbiddenError('Operation denied');
  if (Object.keys(input).length === 0) return false;
  return knex('committee').where({id}).update(input)
}

export const removeCommittee = ({user}: context.UserContext, id: number) => {
  if (!user) throw new ForbiddenError('Operation denied');
  return knex('committee').where({id}).del()
}