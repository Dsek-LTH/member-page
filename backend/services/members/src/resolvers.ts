import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext>= {
  Query: {
    me: (_, __, {user, dataSources}) => {
      if (!user) return undefined
      return dataSources.memberAPI.getMemberFromKeycloakId(user.keycloak_id);
    },
    members: (_, {filter}, {dataSources}) => {
      return dataSources.memberAPI.getMembers(filter);
    },
    positions: (_, {filter}, {dataSources}) => {
      return dataSources.positionAPI.getPositions(filter);
    },
    committees: (_, {filter}, {dataSources}) => {
      return dataSources.committeeAPI.getCommittees(filter);
    },
  },
  Member: {
    __resolveReference: (member, {dataSources}) => {
      const {__typename, ...striped_member} = member
      return dataSources.memberAPI.getMember(striped_member);
    },
  },
  Committee: {
    __resolveReference: (committee, {dataSources}) => {
      return dataSources.committeeAPI.getCommittee(committee);
    },
  },
  Position: {
    __resolveReference: (position, {dataSources}) => {
      return dataSources.positionAPI.getPosition(position);
    },
    committee: async (parent, _, {dataSources}) => {
      return dataSources.committeeAPI.getCommitteeFromPositionId(parent.id)
    },
  },
  Mutation: {
    member: () => ({}),
    committee: () => ({}),
    position: () => ({}),
  },
  MemberMutations: {
    create: (_, {input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.memberAPI.createMember(input.student_id, input.first_name, input.last_name, input.class_programme, input.class_year, input.nickname, input.picture_path);
    },
    update: (_, {id, input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.memberAPI.updateMember(id, input.first_name, input.last_name, input.class_programme, input.class_year, input.nickname, input.picture_path);
    },
    remove: (_, {id}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.memberAPI.removeMember(id);
    }
  },
  CommitteeMutations: {
    create: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.committeeAPI.createCommittee({user, roles}, input)
        .then((res) => (res) ? true : false);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.committeeAPI.updateCommittee({user, roles}, id, input)
        .then((res) => (res) ? true : false);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.committeeAPI.removeCommittee({user, roles}, id)
        .then((res) => (res) ? true : false);
    }
  },
  PositionMutations: {
    create: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.positionAPI.createPosition({user, roles}, input)
        .then((res) => (res) ? true : false);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.positionAPI.updatePosition({user, roles}, id, input)
        .then((res) => (res) ? true : false);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.positionAPI.removePosition({user, roles}, id)
        .then((res) => (res) ? true : false);
    }
  },
}

export default resolvers;
