import { gql } from 'apollo-server';

export default gql`
extend type Query {
  me: Member
}

type Member @key(fields: "id") {
  id: Int!
  student_id: String
  first_name: String
  nickname: String
  last_name: String
  class_programme: String
  class_year: Int
}
`;