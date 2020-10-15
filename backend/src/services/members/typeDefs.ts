import { gql } from 'apollo-server';

export default gql`
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