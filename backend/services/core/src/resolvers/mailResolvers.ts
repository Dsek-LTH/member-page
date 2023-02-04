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
    resolveSenders(_, __, { user, roles, dataSources }) {
      return dataSources.mailAPI.resolveSenders(
        { user, roles },
      );
    },
    alias(_, { email }, { user, roles, dataSources }) {
      return dataSources.mailAPI.getAlias({ user, roles }, email);
    },
    aliases(_, __, { user, roles, dataSources }) {
      return dataSources.mailAPI.getAliases({ user, roles });
    },
    specialSenders(_, { alias }, { user, roles, dataSources }) {
      return dataSources.mailAPI.getSpecialSendersForAlias({ user, roles }, alias);
    },
    specialReceivers(_, { alias }, { user, roles, dataSources }) {
      return dataSources.mailAPI.getSpecialReceiversForAlias({ user, roles }, alias);
    },
    allEmails(_, __, { user, roles, dataSources }) {
      return dataSources.mailAPI.getAllEmails({ user, roles });
    },
  },
  EmailUser: {
    email: (parent) => {
      if (parent.keycloakId) {
        return keycloakAdmin.getUserEmail(parent.keycloakId);
      }
      return parent.email;
    },
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
    specialSender: () => ({}),
    specialReceiver: () => ({}),
  },
  MailAliasMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.mailAPI.createAlias({ user, roles }, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.mailAPI.removeAlias({ user, roles }, id);
    },
    updateSenderStatus(_, { input }, { user, roles, dataSources }) {
      return dataSources.mailAPI.updateSenderStatus({ user, roles }, input);
    },
  },
  SpecialSenderMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.mailAPI.createSpecialSender({ user, roles }, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.mailAPI.removeSpecialSender({ user, roles }, id);
    },
  },
  SpecialReceiverMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.mailAPI.createSpecialReceiver({ user, roles }, input);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.mailAPI.removeSpecialReceiver({ user, roles }, id);
    },
  },
};

export default mailResolvers;
