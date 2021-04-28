import createApolloServer from './server';
import { context } from 'dsek-shared';
import dataSources from './datasources';

const server = createApolloServer(context.deserializeContext, dataSources);

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});