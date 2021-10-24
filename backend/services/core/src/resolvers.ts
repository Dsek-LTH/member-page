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
    members: (_, {page, perPage, filter}, {dataSources}) => {
      return dataSources.memberAPI.getMembers(page, perPage, filter);
    },
    memberById: (_, {id}, {dataSources}) => {
      return dataSources.memberAPI.getMember({id});
    },
    memberByStudentId: (_, {student_id}, {dataSources}) => {
      return dataSources.memberAPI.getMember({student_id});
    },
    positions: (_, {page, perPage, filter}, {dataSources}) => {
      return dataSources.positionAPI.getPositions(page, perPage, filter);
    },
    committees: (_, {page, perPage, filter}, {dataSources}) => {
      return dataSources.committeeAPI.getCommittees(page, perPage, filter);
    },
    mandates: (_, {page, perPage, filter}, {dataSources}) => {
      return dataSources.mandateAPI.getMandates(page, perPage, filter);
    },
    door: (_, {name}, {user, roles, dataSources}) => {
      return dataSources.accessAPI.getDoor({user, roles}, name);
    },
    doors: (_, __, {user, roles, dataSources}) => {
      return dataSources.accessAPI.getDoors({user, roles});
    },
    accessPolicy: (_, {name}, {user, roles, dataSources}) => {
      return dataSources.accessAPI.getAccessPolicy({user, roles}, name);
    },
    accessPolicies: (_, __, {user, roles, dataSources}) => {
      return dataSources.accessAPI.getAccessPolicies({user, roles});
    },
    apiAccess: (_, __, {user, roles, dataSources}) => {
      return dataSources.accessAPI.getApis({user, roles});
    }
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
      return dataSources.committeeAPI.getCommittee({ id: parent.committee?.id });
    },
  },
  Mandate: {
    position: async (parent, _, {dataSources}) => {
      return dataSources.positionAPI.getPosition({ id: parent.position?.id });
    },
    member: async (parent, _, {dataSources}) => {
      return dataSources.memberAPI.getMember({ id: parent.member?.id });
    },
  },
  Door: {
    __resolveReference: (door, {user, roles, dataSources}) => {
      return dataSources.accessAPI.getDoor({user, roles}, door.name);
    },
  },
  AccessPolicy: {
    __resolveReference: (access, {user, roles, dataSources}) => {
      return dataSources.accessAPI.getAccessPolicy({user, roles}, access.id);
    },
  },
  Mutation: {
    member: () => ({}),
    committee: () => ({}),
    position: () => ({}),
    mandate: () => ({}),
    access: () => ({}),
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
      return dataSources.committeeAPI.createCommittee({user, roles}, input);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.committeeAPI.updateCommittee({user, roles}, id, input);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.committeeAPI.removeCommittee({user, roles}, id);
    }
  },
  PositionMutations: {
    create: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.positionAPI.createPosition({user, roles}, input);
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return dataSources.positionAPI.updatePosition({user, roles}, id, input);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.positionAPI.removePosition({user, roles}, id);
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
  AccessMutations: {
    door: () => ({}),
    policy: () => ({}),
  },
  DoorMutations: {
    create: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.accessAPI.createDoor({user, roles}, input);
    },
    remove: (_, {name}, {user, roles, dataSources}) => {
      return dataSources.accessAPI.removeDoor({user, roles}, name);
    },
  },
  PolicyMutations: {
    createDoorAccessPolicy: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.accessAPI.createDoorAccessPolicy({user, roles}, input);
    },
    createApiAccessPolicy: (_, {input}, {user, roles, dataSources}) => {
      return dataSources.accessAPI.createApiAccessPolicy({user, roles}, input);
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return dataSources.accessAPI.removeAccessPolicy({user, roles}, id);
    }
  }
}

export default resolvers;
