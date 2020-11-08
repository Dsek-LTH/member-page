import { gql } from 'apollo-server';

export default gql`
extend type Query {
  me: Member
  positions(filter: PositionFilter): [Position!]!
  committees(filter: CommitteeFilter): [Committee!]!
}

extend type Mutation {
  position: PositionMutations
  committee: CommitteeMutations
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

type Position @key(fields: "id") {
  id: Int!
  name: String!
  committee: Committee
}

type Committee @key(fields: "id") {
  id: Int!
  name: String!
}

input CommitteeFilter {
  id: Int
  name: String
}

input PositionFilter {
  id: Int
  name: String
  committeeId: Int
}

type PositionMutations {
  create(input: CreatePosition!): Boolean
  update(id: Int!, input: UpdatePosition!): Boolean
  remove(id: Int!): Boolean
}

type CommitteeMutations {
  create(input: CreateCommittee!): Boolean
  update(id: Int!, input: UpdateCommittee!): Boolean
  remove(id: Int!): Boolean
}

input CreatePosition {
  name: String!
  committeeId: Int
}

input UpdatePosition {
  name: String
  committeeId: Int
}

input CreateCommittee {
  name: String!
}

input UpdateCommittee {
  name: String
}
`;