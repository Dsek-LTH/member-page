import { ApolloServer } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { defNews } from '../services';

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: defNews.port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
