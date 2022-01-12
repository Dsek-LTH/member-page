/* eslint-disable no-underscore-dangle */
import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    me(_, __, { user, dataSources }) {
      if (!user) return undefined;
      return dataSources.memberAPI.getMemberFromKeycloakId(user.keycloak_id);
    },
    members(_, { page, perPage, filter }, { dataSources, ...ctx }) {
      return dataSources.memberAPI.getMembers(ctx, page, perPage, filter);
    },
    memberById(_, { id }, { dataSources, ...ctx }) {
      return dataSources.memberAPI.getMember(ctx, { id });
    },
    memberByStudentId(_, { student_id }, { dataSources, ...ctx }) {
      return dataSources.memberAPI.getMember(ctx, { student_id });
    },
    positions(_, { page, perPage, filter }, { dataSources, ...ctx }) {
      return dataSources.positionAPI.getPositions(ctx, page, perPage, filter);
    },
    committees(_, { page, perPage, filter }, { dataSources, ...ctx }) {
      return dataSources.committeeAPI.getCommittees(ctx, page, perPage, filter);
    },
    mandates(_, { page, perPage, filter }, { dataSources, ...ctx }) {
      return dataSources.mandateAPI.getMandates(ctx, page, perPage, filter);
    },
    door(_, { name }, { dataSources, ...ctx }) {
      return dataSources.accessAPI.getDoor(ctx, name);
    },
    doors(_, __, { dataSources, ...ctx }) {
      return dataSources.accessAPI.getDoors(ctx);
    },
    accessPolicy(_, { name }, { dataSources, ...ctx }) {
      return dataSources.accessAPI.getAccessPolicy(ctx, name);
    },
    accessPolicies(_, __, { dataSources, ...ctx }) {
      return dataSources.accessAPI.getAccessPolicies(ctx);
    },
    apiAccess(_, __, { dataSources, ...ctx }) {
      return dataSources.accessAPI.getApis(ctx);
    },
  },
  Member: {
    __resolveReference(member, { dataSources, ...ctx }) {
      return dataSources.memberAPI.getMember(ctx, { id: member.id });
    },
  },
  Committee: {
    __resolveReference(committee, { dataSources, ...ctx }) {
      return dataSources.committeeAPI.getCommittee(ctx, committee);
    },
  },
  Position: {
    __resolveReference(position, { dataSources, ...ctx }) {
      return dataSources.positionAPI.getPosition(ctx, position);
    },
    committee(parent, _, { dataSources, ...ctx }) {
      return dataSources.committeeAPI.getCommittee(ctx, { id: parent.committee?.id });
    },
  },
  Mandate: {
    __resolveReference(mandate, { dataSources, ...ctx }) {
      return dataSources.mandateAPI.getMandate(ctx, mandate.id);
    },
    position(parent, _, { dataSources, ...ctx }) {
      return dataSources.positionAPI.getPosition(ctx, { id: parent.position?.id });
    },
    member(parent, _, { dataSources, ...ctx }) {
      return dataSources.memberAPI.getMember(ctx, { id: parent.member?.id });
    },
  },
  Door: {
    __resolveReference(door, { dataSources, ...ctx }) {
      return dataSources.accessAPI.getDoor(ctx, door.name);
    },
  },
  AccessPolicy: {
    __resolveReference(access, { dataSources, ...ctx }) {
      return dataSources.accessAPI.getAccessPolicy(ctx, access.id);
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
    create(_, { input }, { dataSources, ...ctx }) {
      return dataSources.memberAPI.createMember(ctx, input);
    },
    update(_, { id, input }, { dataSources, ...ctx }) {
      return dataSources.memberAPI.updateMember(ctx, id, input);
    },
    remove(_, { id }, { dataSources, ...ctx }) {
      return dataSources.memberAPI.removeMember(ctx, id);
    },
  },
  CommitteeMutations: {
    create(_, { input }, { dataSources, ...ctx }) {
      return dataSources.committeeAPI.createCommittee(ctx, input);
    },
    update(_, { id, input }, { dataSources, ...ctx }) {
      return dataSources.committeeAPI.updateCommittee(ctx, id, input);
    },
    remove(_, { id }, { dataSources, ...ctx }) {
      return dataSources.committeeAPI.removeCommittee(ctx, id);
    },
  },
  PositionMutations: {
    create(_, { input }, { dataSources, ...ctx }) {
      return dataSources.positionAPI.createPosition(ctx, input);
    },
    update(_, { id, input }, { dataSources, ...ctx }) {
      return dataSources.positionAPI.updatePosition(ctx, id, input);
    },
    remove(_, { id }, { dataSources, ...ctx }) {
      return dataSources.positionAPI.removePosition(ctx, id);
    },
  },
  MandateMutations: {
    create(_, { input }, { dataSources, ...ctx }) {
      return dataSources.mandateAPI.createMandate(ctx, input);
    },
    update(_, { id, input }, { dataSources, ...ctx }) {
      return dataSources.mandateAPI.updateMandate(ctx, id, input);
    },
    remove(_, { id }, { dataSources, ...ctx }) {
      return dataSources.mandateAPI.removeMandate(ctx, id);
    },
  },
  AccessMutations: {
    door: () => ({}),
    policy: () => ({}),
  },
  DoorMutations: {
    create(_, { input }, { dataSources, ...ctx }) {
      return dataSources.accessAPI.createDoor(ctx, input);
    },
    remove(_, { name }, { dataSources, ...ctx }) {
      return dataSources.accessAPI.removeDoor(ctx, name);
    },
  },
  PolicyMutations: {
    createDoorAccessPolicy(_, { input }, { dataSources, ...ctx }) {
      return dataSources.accessAPI.createDoorAccessPolicy(ctx, input);
    },
    createApiAccessPolicy(_, { input }, { dataSources, ...ctx }) {
      return dataSources.accessAPI.createApiAccessPolicy(ctx, input);
    },
    remove(_, { id }, { dataSources, ...ctx }) {
      return dataSources.accessAPI.removeAccessPolicy(ctx, id);
    },
  },
};

export default resolvers;
