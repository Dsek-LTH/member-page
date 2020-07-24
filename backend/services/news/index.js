const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const knex = require('../../database');
const services = require('../index');

const typeDefs = gql`
type Article @key(fields: "article_id") {
  article_id: ID!
  body: String
  header: String
  author: Member
  published_datetime: String
  latest_edit_datetime: String
}

extend type Member @key(fields: "stil_id") {
  stil_id: String! @external
}

extend type Query {
  news: [Article]
}
`

const resolvers = {
  Article: {
    author(article) {
      return { __typename: "Member", stil_id: article.author_stil_id}
    }
  },
  Query: {
    async news() {
      return (await knex('articles').select('*'));
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: services.definitions.news.port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
