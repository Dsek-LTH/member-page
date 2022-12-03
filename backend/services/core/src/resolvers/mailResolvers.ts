/* eslint-disable no-underscore-dangle */
import { context } from '../shared';
import { DataSources } from '../datasources';
import { Resolvers } from '../types/graphql';
import keycloakAdmin from '../keycloak';

interface DataSourceContext {
  dataSources: DataSources;
}

const mailResolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    resolveAlias(_, { alias }, { user, roles, dataSources }) {
      return dataSources.mailAPI.resolveAlias(
        { user, roles },
        dataSources,
        alias,
      );
    },
    resolveRecipients(_, __, { user, roles, dataSources }) {
      return dataSources.mailAPI.resolveRecipients(
        { user, roles },
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
  EmailUser: {
    email: (parent) => keycloakAdmin.getUserEmail(parent.keycloakId),
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
  Mutation: {
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
};

export default mailResolvers;
