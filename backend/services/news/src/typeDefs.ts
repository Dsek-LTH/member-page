import { gql } from 'apollo-server';

export default gql`
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