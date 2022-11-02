/* eslint-disable no-underscore-dangle */
import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const coreResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    me(_, __, { user, dataSources }) {
      if (!user) return undefined;
      return dataSources.memberAPI.getMemberFromKeycloakId(user.keycloak_id);
    },
    members(_, { page, perPage, filter }, { user, roles, dataSources }) {
      return dataSources.memberAPI.getMembers(
        { user, roles },
        page,
        perPage,
        filter,
      );
    },
    memberById(_, { id }, { user, roles, dataSources }) {
      return dataSources.memberAPI.getMember({ user, roles }, { id });
    },
    memberByStudentId(_, { student_id }, { user, roles, dataSources }) {
      return dataSources.memberAPI.getMember({ user, roles }, { student_id });
    },
    positions(_, { page, perPage, filter }, { user, roles, dataSources }) {
      return dataSources.positionAPI.getPositions(
        { user, roles },
        page,
        perPage,
        filter,
      );
    },
    committees(_, { page, perPage, filter }, { user, roles, dataSources }) {
      return dataSources.committeeAPI.getCommittees(
        { user, roles },
        page,
        perPage,
        filter,
      );
    },
    mandatePagination(_, { page, perPage, filter }, { user, roles, dataSources }) {
      return dataSources.mandateAPI.getMandates(
        { user, roles },
        page,
        perPage,
        filter,
      );
    },
    door(_, { name }, { user, roles, dataSources }) {
      return dataSources.accessAPI.getDoor({ user, roles }, name);
    },
    doors(_, __, { user, roles, dataSources }) {
      return dataSources.accessAPI.getDoors({ user, roles });
    },
    api(_, { name }, { user, roles, dataSources }) {
      return dataSources.accessAPI.getApi({ user, roles }, name);
    },
    apis(_, __, { user, roles, dataSources }) {
      return dataSources.accessAPI.getApis({ user, roles });
    },
    apiAccess(_, __, { user, roles, dataSources }) {
      return dataSources.accessAPI.getUserApis({ user, roles });
    },
    resolveAlias(_, { alias }, { user, roles, dataSources }) {
      return dataSources.mailAPI.resolveAlias(
        { user, roles },
        dataSources,
        alias,
      );
    },
    alias(_, { email }, { user, roles, dataSources }) {
      return dataSources.mailAPI.getAlias({ user, roles }, email);
    },
    aliases(_, __, { user, roles, dataSources }) {
      return dataSources.mailAPI.getAliases({ user, roles });
    },
    userHasAccessToAlias(
      _,
      { alias, student_id },
      { user, roles, dataSources },
    ) {
      return dataSources.mailAPI.userHasAccessToAlias(
        { user, roles },
        dataSources,
        alias,
        student_id,
      );
    },
  },
  MailAlias: {
    __resolveReference(mailAlias, { user, roles, dataSources }) {
      return dataSources.mailAPI.getAlias({
        user, roles,
      }, mailAlias.email);
    },
    policies(mailAlias, _, { user, roles, dataSources }) {
      return dataSources.mailAPI.getPoliciesFromAlias(
        { user, roles },
        mailAlias.email,
      );
    },
  },
  Member: {
    __resolveReference(member, { user, roles, dataSources }) {
      return dataSources.memberAPI.getMember(
        { user, roles },
        { id: member.id },
      );
    },
    mandates(member, { onlyActive }, { user, roles, dataSources }) {
      return dataSources.mandateAPI.getMandatesForMember(
        { user, roles },
        member.id,
        onlyActive,
      );
    },
  },
  Committee: {
    __resolveReference(committee, { user, roles, dataSources }) {
      return dataSources.committeeAPI.getCommittee({ user, roles }, committee);
    },
  },
  Position: {
    __resolveReference(position, { user, roles, dataSources }) {
      return dataSources.positionAPI.getPosition({ user, roles }, position);
    },
    committee(parent, _, { user, roles, dataSources }) {
      return dataSources.committeeAPI.getCommittee(
        { user, roles },
        { id: parent.committee?.id },
      );
    },
  },
  Mandate: {
    __resolveReference(mandate, { user, roles, dataSources }) {
      return dataSources.mandateAPI.getMandate({ user, roles }, mandate.id);
    },
    position(parent, _, { user, roles, dataSources }) {
      return dataSources.positionAPI.getPosition(
        { user, roles },
        { id: parent.position?.id },
      );
    },
    member(parent, _, { user, roles, dataSources }) {
      return dataSources.memberAPI.getMember(
        { user, roles },
        { id: parent.member?.id },
      );
    },
  },
  Door: {
    __resolveReference(door, { user, roles, dataSources }) {
      return dataSources.accessAPI.getDoor({ user, roles }, door.name);
    },
  },
  Mutation: {
    member: () => ({}),
    committee: () => ({}),
    position: () => ({}),
    mandate: () => ({}),
    access: () => ({}),
    admin: () => ({}),
    alias: () => ({}),
  },
  MailAliasMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.mailAPI.createAlias({ user, roles }, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.mailAPI.removeAlias({ user, roles }, id);
    },
  },
  MemberMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.memberAPI.createMember({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.memberAPI.updateMember({ user, roles }, id, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.memberAPI.removeMember({ user, roles }, id);
    },
  },
  CommitteeMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.committeeAPI.createCommittee({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.committeeAPI.updateCommittee(
        { user, roles },
        id,
        input,
      );
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.committeeAPI.removeCommittee({ user, roles }, id);
    },
  },
  PositionMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.positionAPI.createPosition({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.positionAPI.updatePosition({ user, roles }, id, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.positionAPI.removePosition({ user, roles }, id);
    },
  },
  MandateMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.mandateAPI.createMandate({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.mandateAPI.updateMandate({ user, roles }, id, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.mandateAPI.removeMandate({ user, roles }, id);
    },
  },
  AccessMutations: {
    door: () => ({}),
    policy: () => ({}),
  },
  DoorMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.accessAPI.createDoor({ user, roles }, input);
    },
    remove(_, { name }, { user, roles, dataSources }) {
      return dataSources.accessAPI.removeDoor({ user, roles }, name);
    },
  },
  PolicyMutations: {
    createDoorAccessPolicy(_, { input }, { user, roles, dataSources }) {
      return dataSources.accessAPI.createDoorAccessPolicy(
        { user, roles },
        input,
      );
    },
    createApiAccessPolicy(_, { input }, { user, roles, dataSources }) {
      return dataSources.accessAPI.createApiAccessPolicy(
        { user, roles },
        input,
      );
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.accessAPI.removeAccessPolicy({ user, roles }, id);
    },
  },
  AdminMutations: {
    updateSearchIndex(_, __, { user, roles, dataSources }) {
      return dataSources.memberAPI.updateSearchIndex({ user, roles });
    },
    syncMandatesWithKeycloak(_, __, { user, roles, dataSources }) {
      return dataSources.mandateAPI.syncMandatesWithKeycloak({ user, roles });
    },
  },
};

export default coreResolvers;
