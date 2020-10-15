const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const knex = require('../../database');
const services = require('../index');

const typeDefs = gql`
extend type Query {
  me: Member
}

type Member @key(fields: "stil_id") {
  stil_id: String!
  name: String!
  programme: String
  first_year: Int
}
`;

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) return null;
      const me = (await knex('members').where('stil_id', context.user.stil_id).select('*'))[0];
      return me;
    }
  },
  Member: {
    async __resolveReference(object) {
      return (await knex('members').where('stil_id', object.stil_id).select('*'))[0]
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: ({req}) => {
    try {
      const user = (req.headers['x-user']) ? JSON.parse(req.headers['x-user']) : undefined;
      const roles = (req.headers['x-roles']) ? JSON.parse(req.headers['x-roles']) : undefined;
      return {user: user, roles: roles};
    } catch (e) {
      return {}
    }
  }
});

server.listen({ port: services.definitions.members.port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});