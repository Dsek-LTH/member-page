import { gql } from 'apollo-server';

export default gql`
type Event @key(fields: "id"){
    id: Int!
    title: String!
    description: String!
    link: String!
    start_datetime: Datetime!
    end_datetime: Datetime!
}

scalar Datetime

input EventFilter{
    id: Int
    from: Datetime
    to: Datetime
}

extend type Query {
    event(id: Int!): Event
    events:[Event!]!
}
`