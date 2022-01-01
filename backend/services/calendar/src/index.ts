import { context, createLogger } from 'dsek-shared';
import createApolloServer from './server';
import dataSources from './datasources';

const logger = createLogger('calendar-service');

const server = createApolloServer(context.deserializeContext, dataSources);

server.listen({ port: 4000 }).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
});
