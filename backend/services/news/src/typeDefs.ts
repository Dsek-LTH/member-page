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

scalar Datetime

extend type Member @key(fields: "id") {
  id: Int! @external
}

extend type Query {
  news: [Article!]!
}
`