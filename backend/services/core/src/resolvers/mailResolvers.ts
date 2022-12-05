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
  },
  EmailUser: {
    email: (parent) => keycloakAdmin.getUserEmail(parent.keycloakId),
  },
  MailAlias: {
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
