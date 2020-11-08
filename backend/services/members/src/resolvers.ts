import {
  DbMember,
  getMember,
  PositionFilter,
  CommitteeFilter,
  getCommittees,
  createCommittee,
  CreateCommittee,
  getPositions,
  DbPosition,
  UpdateCommittee,
  updateCommittee,
  removeCommittee,
  CreatePosition,
  createPosition,
  updatePosition,
  UpdatePosition,
  removePosition,
} from './db';
import { context, dbUtils } from 'dsek-shared';

export default {
  Query: {
    async me({}, {}, {user, roles}: context.UserContext) {
      if (!user?.student_id) return undefined;
      const me = await getMember({student_id: user.student_id});
      return me;
    },
    positions: ({}, {filter}: {filter?: PositionFilter}) => {
      return getPositions(filter);
    },
    committees: ({}, {filter}: {filter?: CommitteeFilter}) => {
      return getCommittees(filter);
    }
  },
  Member: {
    async __resolveReference(member: DbMember) {
      return await getMember({id: member.id});
    }
  },
  Committee: {
    __resolveReference: (committee: CommitteeFilter) =>
      dbUtils.unique(getCommittees(committee)),
  },
  Position: {
    __resolveReference: (position: PositionFilter) =>
      dbUtils.unique(getPositions(position)),
    committee: (parent: DbPosition) =>
      dbUtils.unique(getCommittees({id: parent.committee_id}))
  },
  Mutation: {
    committee: () => ({}),
    position: () => ({}),
  },
  CommitteeMutations: {
    create: ({}, {input}: {input: CreateCommittee}, {user, roles}: context.UserContext) => {
      return createCommittee({user, roles}, input)
        .then((res) => (res) ? true : false);
    },
    update: ({}, {id, input}: {id: number, input: UpdateCommittee}, {user, roles}: context.UserContext) => {
      return updateCommittee({user, roles}, id, input)
        .then((res) => (res) ? true : false);
    },
    remove: ({}, {id}: {id: number}, {user, roles}: context.UserContext) => {
      return removeCommittee({user, roles}, id)
        .then((res) => (res) ? true : false);
    }
  },
  PositionMutations: {
    create: ({}, {input}: {input: CreatePosition}, {user, roles}: context.UserContext) => {
      return createPosition({user, roles}, input)
        .then((res) => (res) ? true : false);
    },
    update: ({}, {id, input}: {id: number, input: UpdatePosition}, {user, roles}: context.UserContext) => {
      return updatePosition({user, roles}, id, input)
        .then((res) => (res) ? true : false);
    },
    remove: ({}, {id}: {id: number}, {user, roles}: context.UserContext) => {
      return removePosition({user, roles}, id)
        .then((res) => (res) ? true : false);
    }
  }
};