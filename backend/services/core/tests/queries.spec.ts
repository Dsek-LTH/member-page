import 'mocha';
import chai, { expect, assert } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { Committee, Member, MemberFilter, Position } from '../src/types/graphql';
import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const GET_ME = gql`
query {
  me {
    id
    student_id
    first_name
    nickname
    last_name
    class_programme
    class_year
  }
}
`

const GET_MEMBER_ID = gql`
query getMemberById($id: Int!) {
  memberById(id: $id) {
    id
    student_id
    first_name
    nickname
    last_name
    class_programme
    class_year
  }
}
`

const GET_MEMBER_STUDENT_ID = gql`
query getMemberByStudentId($student_id: String!) {
  memberByStudentId(student_id: $student_id) {
    id
    student_id
    first_name
    nickname
    last_name
    class_programme
    class_year
  }
}
`

const GET_MEMBERS = gql`
query {
  members {
    id
    student_id
    first_name
    nickname
    last_name
    class_programme
    class_year
  }
}
`

const GET_MEMBERS_ARGS = gql`
query getMembers($id: Int, $student_id: String, $first_name: String, $nickname: String, $last_name: String, $class_programme: String, $class_year: Int) {
  members(filter: {id: $id, student_id: $student_id, first_name: $first_name, nickname: $nickname, last_name: $last_name, class_programme: $class_programme, class_year: $class_year}) {
    id
    student_id
    first_name
    nickname
    last_name
    class_programme
    class_year
  }
}
`
const GET_POSITIONS_ARGS = gql`
query getPositions($id: Int, $name: String, $committee_id: Int) {
  positions(filter: {id: $id, name: $name, committee_id: $committee_id}) {
    id
    name
    committee {
      id
      name
    }
  }
}
`

const GET_POSITIONS = gql`
query {
  positions {
    id
    name
    committee {
      id
      name
    }
  }
}
`

const GET_COMMITTEES_ARGS = gql`
query getCommittees($id: Int, $name: String) {
  committees(filter: {id: $id, name: $name}) {
    id
    name
  }
}
`

const GET_COMMITTEES = gql`
query {
  committees {
    id
    name
  }
}
`

const member: Member = {
  id: 1,
  student_id: 'ab1234cd-s',
  first_name: 'Sven',
  last_name: 'Svensson',
  nickname: 'Bertil',
  class_programme: 'D',
  class_year: 1995,
}

const members: Member[] = [
  {
    id: 1,
    student_id: 'ab1234cd-s',
    first_name: 'Sven',
    last_name: 'Svensson',
    nickname: 'Bertil',
    class_programme: 'D',
    class_year: 1995,
  },
  {
    id: 2,
    student_id: 'ac3234cf-s',
    first_name: 'Stina',
    last_name: 'Karlsson',
    nickname: 'Per',
    class_programme: 'D',
    class_year: 1995,
  },
  {
    id: 3,
    student_id: 'jh3234cf-s',
    first_name: 'Lars',
    last_name: 'Karlsson',
    nickname: 'Per',
    class_programme: 'D',
    class_year: 1992,
  },
  {
    id: 4,
    student_id: 'gf3234cf-s',
    first_name: 'Pier',
    last_name: 'Leon',
    nickname: 'Peter',
    class_programme: 'C',
    class_year: 1996,
  }
]

const committees: Committee[] = [
  { id: 10, name: 'Informationsutskottet' },
  { id: 11, name: 'Sexmästeriet' },
  { id: 12, name: 'Studierådet' },
]

const positions: Position[] = [
  { id: 1, name: 'Fotograf', },
  { id: 2, name: 'Köksmästare', },
  { id: 3, name: 'Studierådordförande', },
  { id: 4, name: 'Talman', },
  { id: 5, name: 'Artist', },
]

const positionsWithCommittees = [
  {...positions[0], committee: committees[0]},
  {...positions[1], committee: committees[1]},
  {...positions[2], committee: committees[2]},
  {...positions[3], committee: null},
  {...positions[4], committee: committees[0]},
]

describe('[Queries]', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(() => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;

    const c = createTestClient(server);
    client = c;
  })

  beforeEach(() => {
    sandbox.on(dataSources.memberAPI, 'getMember', (identifier) => {
      return new Promise(resolve => resolve(member))
    })
    sandbox.on(dataSources.memberAPI, 'getMembers', (filter) => {
      return new Promise(resolve => resolve(members))
    })
    sandbox.on(dataSources.positionAPI, 'getPositions', (filter) => {
      return new Promise(resolve => resolve(positions.filter((p, i) =>
        !filter || (!filter.id || filter.id === p.id) && (!filter.name || filter.name === p.name) &&
        (!filter.committee_id || filter.committee_id === positionsWithCommittees[i].committee?.id)
      )))
    })
    sandbox.on(dataSources.committeeAPI, 'getCommitteeFromPositionId', (id: number) => {
      return new Promise(resolve => resolve(positionsWithCommittees.find(p => p.id === id)?.committee))
    })
    sandbox.on(dataSources.committeeAPI, 'getCommittees', (filter) => {
      return new Promise(resolve => resolve(committees.filter((p) =>
        !filter || (!filter.id || filter.id === p.id) && (!filter.name || filter.name === p.name)
       )))
    })
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[me]', () => {

    it('returns signed in user', async () => {
      const { server, dataSources } = constructTestServer({user: {keycloak_id: 'kc_1'}});
      const { query } = createTestClient(server);
      sandbox.on(dataSources.memberAPI, 'getMemberFromKeycloakId', () => new Promise(resolve => resolve(member)))

      const { data } = await query({query: GET_ME});
      expect(data).to.deep.equal({me: member});
    })

    it('returns null on no user', async () => {
      const { data } = await client.query({query: GET_ME})
      expect(data).to.deep.equal({me: null});
    })
  })

  describe('[member]', () => {

    it('gets member with id', async () => {
      const input = { id: 1 }
      const { data } = await client.query({query: GET_MEMBER_ID, variables: input})
      expect(dataSources.memberAPI.getMember).to.have.been.called.with(input)
      expect(data).to.deep.equal({ memberById: { ...member } })
    })

    it('gets member with student_id', async () => {
      const input = { student_id: 'ab1234cd-s' }
      const { data } = await client.query({query: GET_MEMBER_STUDENT_ID, variables: input})
      expect(dataSources.memberAPI.getMember).to.have.been.called.with(input)
      expect(data).to.deep.equal({ memberByStudentId: { ...member } })
    })
  })

  describe('[members]', () => {

    it('gets all members', async () => {
      const { data } = await client.query({query: GET_MEMBERS})
      expect(data).to.deep.equal({ members })
    })

    it('gets members using filter', async () => {
      const filter: MemberFilter = { class_year: 1995 }
      await client.query({query: GET_MEMBERS_ARGS, variables: filter})
      expect(dataSources.memberAPI.getMembers).to.have.been.called.with(filter);
    })
  })

  describe('[positions]', () => {

    it('gets positions with committees', async () => {
      const { data } = await client.query({query: GET_POSITIONS})
      expect(dataSources.positionAPI.getPositions).to.have.been.called.once
      expect(dataSources.committeeAPI.getCommitteeFromPositionId).to.have.been.called.exactly(positions.length)
      expect(data).to.deep.equal({ positions: positionsWithCommittees })
    })

    it('gets positions using filter', async () => {
      const { data } = await client.query({query: GET_POSITIONS_ARGS, variables: {committee_id: 10}})
      expect(data).to.deep.equal({ positions: [positionsWithCommittees[0], positionsWithCommittees[4]] });
    })

    it('gets no position on no match', async () => {
      const { data } = await client.query({query: GET_POSITIONS_ARGS, variables: {id: 100}})
      expect(data).to.deep.equal({ positions: [], })
    })
  })

  describe('[committees]', () => {

    it('get committees', async () => {
      const { data } = await client.query({query: GET_COMMITTEES})
      expect(data).to.deep.equal({ committees: committees })
    })

    it('gets committees using filter', async () => {
      const { data } = await client.query({query: GET_COMMITTEES_ARGS, variables: {id: 10}})
      expect(data).to.deep.equal({ committees: [committees[0]] });
    })

    it('gets no position on no match', async () => {
      const { data } = await client.query({query: GET_COMMITTEES_ARGS, variables: {id: 100}})
      expect(data).to.deep.equal({ committees: [], })
    })
  })
})