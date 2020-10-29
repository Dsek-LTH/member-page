import { gql } from 'apollo-server';

export default gql`
type Article @key(fields: "id") {
  id: Int!
  body: String
  header: String
  author: Member
  published_datetime: String
  latest_edit_datetime: String
}

extend type Member @key(fields: "id") {
  id: Int! @external
}

extend type Query {
  news: [Article!]
}
`