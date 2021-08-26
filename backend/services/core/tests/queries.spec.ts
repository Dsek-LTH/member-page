import 'mocha';
import chai, { expect, assert } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { Committee, Member, MemberFilter, Position, Mandate, PaginationInfo, MandatePagination, MemberPagination, CommitteePagination } from '../src/types/graphql';
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
    members {
      id
      student_id
      first_name
      nickname
      last_name
      class_programme
      class_year
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`

const GET_MEMBERS_ARGS = gql`
query getMembers($page: Int, $perPage: Int, $id: Int, $student_id: String, $first_name: String, $nickname: String, $last_name: String, $class_programme: String, $class_year: Int) {
  members(page: $page, perPage: $perPage, filter: {id: $id, student_id: $student_id, first_name: $first_name, nickname: $nickname, last_name: $last_name, class_programme: $class_programme, class_year: $class_year}) {
    members {
      id
      student_id
      first_name
      nickname
      last_name
      class_programme
      class_year
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`
const GET_POSITIONS_ARGS = gql`
query getPositions($page: Int, $perPage: Int, $id: Int, $name: String, $committee_id: Int) {
  positions(page: $page, perPage: $perPage, filter: {id: $id, name: $name, committee_id: $committee_id}) {
    positions {
      id
      name
      committee {
        id
        name
      }
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`

const GET_POSITIONS = gql`
query {
  positions {
    positions {
      id
      name
      committee {
        id
        name
      }
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`

const GET_COMMITTEES_ARGS = gql`
query getCommittees($page: Int, $perPage: Int, $id: Int, $name: String) {
  committees(page: $page, perPage: $perPage, filter: {id: $id, name: $name}) {
    committees {
      id
      name
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`

const GET_COMMITTEES = gql`
query {
  committees {
    committees {
      id
      name
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`

const GET_MANDATES = gql`
query {
  mandates {
    mandates {
      id
      start_date
      end_date
      position {
        id
      }
      member {
        id
      }
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`


const GET_MANDATES_ARGS = gql`
query getMandates($page: Int, $perPage: Int, $id: Int, $position_id: Int, $member_id: Int, $start_date: Date, $end_date: Date) {
  mandates(page: $page, perPage: $perPage, filter: {id: $id, position_id: $position_id, member_id: $member_id, start_date: $start_date, end_date: $end_date}) {
    mandates {
      id
      start_date
      end_date
      position {
        id
      }
      member {
        id
      }
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
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

const mandates: Mandate[] = [
  {
    id: 1,
    start_date: new Date("2021-01-01 00:00:00"),
    end_date: new Date("2022-01-01 00:00:00"),
    position: { id: 5 },
    member: { id: 1 }
  },
  {
    id: 2,
    start_date: new Date("2021-02-01 00:00:00"),
    end_date: new Date("2021-06-01 00:00:00"),
    position: { id: 5 },
    member: { id: 2 }
  },
  {
    id: 3,
    start_date: new Date("2021-03-01 00:00:00"),
    end_date: new Date("2021-03-31 00:00:00"),
    position: { id: 1 },
    member: { id: 3 }
  },
]

const pageInfo: PaginationInfo = {
  totalPages: 1,
  totalItems: 10,
  page: 0,
  perPage: 5,
  hasNextPage: false,
  hasPreviousPage: false,
}

const {totalItems, ...rest} = pageInfo

const memberPagination: MemberPagination = {
  members: members,
  pageInfo: {
    totalItems: members.length,
    ...rest
  },
}

const committeePagination: CommitteePagination = {
  committees: committees,
  pageInfo: {
    totalItems: committees.length,
    ...rest
  },
}

const positionPagination = {
  positions: positionsWithCommittees,
  pageInfo: {
    totalItems: positionsWithCommittees.length,
    ...rest
  },
}

const mandatePagination: MandatePagination = {
  mandates: mandates,
  pageInfo: {
    totalItems: mandates.length,
    ...rest
  },
}


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
      const member = members.filter((m) =>
        (!identifier.id || identifier.id == m.id) &&
        (!identifier.student_id || identifier.student_id == m.student_id)
      )[0]
      return new Promise(resolve => resolve(member))
    })
    sandbox.on(dataSources.memberAPI, 'getMembers', (page, perPage, filter) => {
      const filtered_members = members.filter((m,i) =>
        !filter || (!filter.id || filter.id === m.id) &&
        (!filter.student_id || filter.student_id === m.student_id) &&
        (!filter.first_name || filter.first_name === m.first_name) &&
        (!filter.nickname || filter.nickname == m.nickname) &&
        (!filter.last_name || filter.last_name == m.last_name) &&
        (!filter.class_programme || filter.class_programme == m.class_programme) &&
        (!filter.class_year || filter.class_year == m.class_year)
      );

      return new Promise(resolve => resolve({
        members: filtered_members,
        pageInfo: {
          totalItems: filtered_members.length,
          ...rest
        }
      }))
    })
    sandbox.on(dataSources.positionAPI, 'getPosition', (identifier) => {
      const position = positions.filter((p) => identifier.id === p.id)[0]
      return new Promise(resolve => resolve(position))
    })
    sandbox.on(dataSources.positionAPI, 'getPositions', (page, perPage, filter) => {
      const filtered_positions = positionsWithCommittees.filter((p) =>
        !filter || (!filter.id || filter.id === p.id) && (!filter.name || filter.name === p.name)
        && (!filter.committee_id || filter.committee_id === p.committee?.id)
      )
      return new Promise(resolve => resolve({
        positions: filtered_positions,
        pageInfo: {
          totalItems: filtered_positions.length,
          ...rest
        }
      }))
    })
    sandbox.on(dataSources.committeeAPI, 'getCommitteeFromPositionId', (id: number) => {
      return new Promise(resolve => resolve(positionsWithCommittees.find(p => p.id === id)?.committee))
    })
    sandbox.on(dataSources.committeeAPI, 'getCommittee', (identifier) => {
      if(!identifier.id) return null;
      const committee = committees.filter((c) =>
        (!identifier.id || identifier.id == c.id)
      )[0]
      return new Promise(resolve => resolve(committee))
    })
    sandbox.on(dataSources.committeeAPI, 'getCommittees', (page, perPage, filter) => {
      const filtered_committees = committees.filter((p) =>
        !filter || (!filter.id || filter.id === p.id) &&
        (!filter.name || filter.name === p.name)
      )

      return new Promise(resolve => resolve({
        committees: filtered_committees,
        pageInfo: {
          totalItems: filtered_committees.length,
          ...rest
        }
      }))
    })
    sandbox.on(dataSources.mandateAPI, 'getMandates', (page, perPage, filter) => {
      const filtered_mandates = mandates.filter((m,i) =>
        !filter || (!filter.id || filter.id === m.id) &&
        (!filter.position_id || filter.position_id === m.position?.id) &&
        (!filter.member_id || filter.member_id === m.member?.id) &&
        (!filter.start_date || filter.start_date <= m.start_date) &&
        (!filter.end_date || m.start_date <= filter.end_date)
      );

      const {totalItems, ...rest} = pageInfo

      return new Promise(resolve => resolve({
        mandates: filtered_mandates,
        pageInfo: {
          totalItems: filtered_mandates.length,
          ...rest
        }
      }))
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
      expect(dataSources.memberAPI.getMembers).to.have.been.called();
      expect(data).to.deep.equal({members: memberPagination})
    })

    it('gets members using filter', async () => {
      const filter: MemberFilter = {
        class_year: 1995
      }
      const { data } = await client.query({query: GET_MEMBERS_ARGS, variables: filter})
      expect(dataSources.memberAPI.getMembers).to.have.been.called.with(filter);
      const filtered = [members[0], members[1]]
      const {totalItems, ...rest} = pageInfo
      const expected = {
        members: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...rest
        }
      }
      expect(data).to.deep.equal({members: expected})
    })
  })

  describe('[positions]', () => {

    it('gets positions with committees', async () => {
      const { data } = await client.query({query: GET_POSITIONS})
      expect(dataSources.positionAPI.getPositions).to.have.been.called.once
      expect(dataSources.committeeAPI.getCommittee).to.have.been.called.exactly(positions.length)
      expect(data).to.deep.equal({ positions: positionPagination })
    })

    it('gets positions using filter', async () => {
      const { data } = await client.query({query: GET_POSITIONS_ARGS, variables: {committee_id: 10}})
      const filtered = [positionsWithCommittees[0], positionsWithCommittees[4]]
      const expected = {
        positions: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...rest
        }
      }
      expect(dataSources.positionAPI.getPositions).to.have.been.called()
      expect(data).to.deep.equal({ positions: expected });

    })

    it('gets no position on no match', async () => {
      const { data } = await client.query({query: GET_POSITIONS_ARGS, variables: {page: 0, perPage: 10, id: 100}})
      const expected = {
        positions: [],
        pageInfo: {
          totalItems: 0,
          ...rest
        }
      }
      expect(data).to.deep.equal({ positions: expected })
    })
  })

  describe('[committees]', () => {

    it('get committees', async () => {
      const { data } = await client.query({query: GET_COMMITTEES})
      expect(data).to.deep.equal({ committees: committeePagination })
    })

    it('gets committees using filter', async () => {
      const variables = {page:0, perPage: 10, id: 10}
      const { data } = await client.query({query: GET_COMMITTEES_ARGS, variables: variables})
      const {totalItems, ...rest} = pageInfo
      const filtered = [committees[0]]
      const expected = {
        committees: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...rest
        }
      }
      expect(data).to.deep.equal({committees: expected});
    })

    it('gets no position on no match', async () => {
      const variables = {page: 0, perPage: 10, id: 100}
      const { data } = await client.query({query: GET_COMMITTEES_ARGS, variables: variables})
      const {totalItems, ...rest} = pageInfo
      const expected = {
        committees: [],
        pageInfo: {
          totalItems: 0,
          ...rest
        }
      }
      expect(data).to.deep.equal({committees: expected})
    })
  })

  describe('[mandates]', () => {
    it('gets all mandates', async () => {
      const variables = { page: 0, perPage: 10 }
      const { data } = await client.query({query: GET_MANDATES, variables: variables })
      expect(dataSources.mandateAPI.getMandates).to.have.been.called();
      expect(data).to.deep.equal({ mandates: mandatePagination })
    })

    it('gets mandates using filter with position_id', async () => {
      const variables = {
        page: 1,
        perPage: 10,
        position_id: 5
      }
      const { data } = await client.query({query: GET_MANDATES_ARGS, variables: variables});
      const {totalItems, ...rest} = pageInfo
      const filtered = [mandates[0], mandates[1]]
      const expected: MandatePagination = {
        mandates: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...rest
        },
      }
      expect(dataSources.mandateAPI.getMandates).to.have.been.called.with(variables.page);
      expect(dataSources.mandateAPI.getMandates).to.have.been.called.with(variables.perPage);
      expect(dataSources.mandateAPI.getMandates).to.have.been.called.with({ position_id: variables.position_id });
      expect(data).to.deep.equal({ mandates: expected })
    })

    it('gets mandates using filter with dates', async () => {
      const variables = {
        page: 1,
        perPage: 10,
        start_date: new Date("2021-02-15 00:00:00"),
        end_date: new Date("2021-03-15 00:00:00"),
      }
      const { data } = await client.query({query: GET_MANDATES_ARGS, variables: variables});
      const {totalItems, ...rest} = pageInfo
      const filtered = [mandates[2]]
      const expected: MandatePagination = {
        mandates: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...rest
        },
      }
      expect(dataSources.mandateAPI.getMandates).to.have.been.called();
      expect(data).to.deep.equal({ mandates: expected })
    })

    it('gets mandates using filter with dates and position_id', async () => {
      const variables = {
        page: 1,
        perPage: 10,
        position_id: 5,
        start_date: new Date("2021-01-15 00:00:00"),
      }
      const { data } = await client.query({query: GET_MANDATES_ARGS, variables: variables});
      const {totalItems, ...rest} = pageInfo
      const filtered = [mandates[1]]
      const expected: MandatePagination = {
        mandates: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...rest
        },
      }
      expect(dataSources.mandateAPI.getMandates).to.have.been.called();
      expect(data).to.deep.equal({ mandates: expected })
    })
  })

})