/* eslint-disable no-underscore-dangle */
import { context } from 'dsek-shared';
import { Resolvers } from './types/graphql';
import { DataSources } from './datasources';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    bookingIsDead: () => true,
  },
};

export default resolvers;
