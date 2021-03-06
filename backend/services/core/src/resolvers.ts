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
    memberById: (_, {id}, {dataSources}) => {
      return dataSources.memberAPI.getMember({id});
    },
    memberByStudentId: (_, {student_id}, {dataSources}) => {
      return dataSources.memberAPI.getMember({student_id});
    },
    positions: (_, {filter}, {dataSources}) => {
      return dataSources.positionAPI.getPositions(filter);
    },
    committees: (_, {filter}, {dataSources}) => {
      return dataSources.committeeAPI.getCommittees(filter);
    },
    mandates: (_, {filter}, {dataSources}) => {
      return dataSources.mandateAPI.getMandates(filter);
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
  Mandate: {
    position: async (parent, _, {dataSources}) => {
      return dataSources.positionAPI.getPosition({ id: parent.position?.id })
    },
    member: async (parent, _, {dataSources}) => {
      return dataSources.memberAPI.getMember({ id: parent.member?.id })
    },
  },
  Mutation: {
    member: () => ({}),
    committee: () => ({}),
    position: () => ({}),
    mandate: () => ({}),
  },
  MemberMutations: {
    create: (_, {input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.memberAPI.createMember(input);
    },
    update: (_, {id, input}, {user, dataSources}) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return dataSources.memberAPI.updateMember(id, input);
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
  MandateMutations: {
    create: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.mandateAPI.createMandate({user, roles}, input);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.mandateAPI.updateMandate({user, roles}, id, input);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.mandateAPI.removeMandate({user, roles}, id);
    },
  },
}

export default resolvers;
