import { gql } from 'apollo-server';

export default gql`
type Article @key(fields: "id") {
  id: Int!
  body: String!
  header: String!
  author: Member!
  published_datetime: Datetime!
  latest_edit_datetime: Datetime
}

type PaginationInfo {
  totalPages: Int!
  totalItems: Int!
  page: Int!
  perPage: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

type ArticlePagination {
  articles: [Article]!
  pageInfo: PaginationInfo!
}

scalar Datetime

extend type Member @key(fields: "id") {
  id: Int! @external
}

extend type Query {
  news(page: Int! = 0, perPage: Int! = 20): ArticlePagination
  article(id: Int!): Article
}

extend type Mutation {
  article: ArticleMutations
}

type ArticleMutations {
  create(input: CreateArticle): Article
  update(id: Int!, input: UpdateArticle): Article
  remove(id: Int!): Article
}

input CreateArticle {
  header: String!, 
  body: String!,
}

input UpdateArticle {
  header: String, 
  body: String,
}
`