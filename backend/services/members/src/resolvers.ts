import * as db from './db';
import * as gql from './types/graphql';
import { context } from 'dsek-shared';

const resolvers: gql.Resolvers<context.UserContext>= {
  Query: {
    me: ({}, {}, {user}): Promise<gql.Maybe<gql.Member>> => {
      return db.getMember({ student_id: user.student_id });
    },
    positions: ({}, {filter}: gql.QueryPositionsArgs): Promise<gql.Position[]> => {
      if (filter) return db.getPositions(filter);
      return db.getAllPositions();
    },
    committees: ({}, {filter}: gql.QueryCommitteesArgs): Promise<gql.Committee[]> => {
      if (filter) return db.getCommittees(filter);
      return db.getAllCommittees();
    },
  },
  Member: {
    __resolveReference: (member): Promise<gql.Maybe<gql.Member>> => {
      const {__typename, ...striped_member} = member
      return db.getMember(striped_member);
    },
  },
  Committee: {
    __resolveReference: (committee): Promise<gql.Maybe<gql.Committee>> => {
      return db.getCommittee(committee);
    },
  },
  Position: {
    __resolveReference: (position): Promise<gql.Maybe<gql.Position>> => {
      return db.getPosition(position);
    },
    committee: async (parent): Promise<gql.Maybe<gql.Committee>> => {
      return db.getCommitteeFromPositionId(parent.id)
    },
  },
  Mutation: {
    committee: () => ({}),
    position: () => ({}),
  },
  CommitteeMutations: {
    create: ({}, {input}: gql.CommitteeMutationsCreateArgs, {user, roles}: context.UserContext) => {
      return db.createCommittee({user, roles}, input)
        .then((res) => (res) ? true : false);
    },
    update: ({}, {id, input}: gql.CommitteeMutationsUpdateArgs, {user, roles}: context.UserContext) => {
      return db.updateCommittee({user, roles}, id, input)
        .then((res) => (res) ? true : false);
    },
    remove: ({}, {id}: gql.CommitteeMutationsRemoveArgs, {user, roles}: context.UserContext) => {
      return db.removeCommittee({user, roles}, id)
        .then((res) => (res) ? true : false);
    }
  },
  PositionMutations: {
    create: ({}, {input}: gql.PositionMutationsCreateArgs, {user, roles}: context.UserContext) => {
      return db.createPosition({user, roles}, input)
        .then((res) => (res) ? true : false);
    },
    update: ({}, {id, input}: gql.PositionMutationsUpdateArgs, {user, roles}: context.UserContext) => {
      return db.updatePosition({user, roles}, id, input)
        .then((res) => (res) ? true : false);
    },
    remove: ({}, {id}: gql.PositionMutationsRemoveArgs, {user, roles}: context.UserContext) => {
      return db.removePosition({user, roles}, id)
        .then((res) => (res) ? true : false);
    }
  },
}

export default resolvers;