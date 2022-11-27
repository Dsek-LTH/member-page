import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import {
  Committee,
  Member,
  MemberFilter,
  Position,
  //  Mandate,
  PaginationInfo,
  MandatePagination,
  MemberPagination,
  CommitteePagination,
  FastMandate,
} from '~/src/types/graphql';
import { DataSources } from '~/src/datasources';
import constructTestServer from '../util';

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
`;

const GET_MEMBER_ID = gql`
query getMemberById($id: UUID!) {
  member(id: $id) {
    id
    student_id
    first_name
    nickname
    last_name
    class_programme
    class_year
  }
}
`;

const GET_MEMBER_STUDENT_ID = gql`
query getMemberByStudentId($student_id: String!) {
  member(student_id: $student_id) {
    id
    student_id
    first_name
    nickname
    last_name
    class_programme
    class_year
  }
}
`;

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
`;

const GET_MEMBERS_ARGS = gql`
query getMembers($page: Int, $perPage: Int, $id: UUID, $student_id: String, $first_name: String, $nickname: String, $last_name: String, $class_programme: String, $class_year: Int) {
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
`;
const GET_POSITIONS_ARGS = gql`
query getPositions($page: Int, $perPage: Int, $id: String, $name: String, $committee_id: UUID) {
  positions(page: $page, perPage: $perPage, filter: {id: $id, name: $name, committee_id: $committee_id}) {
    positions {
      id
      name
      committee {
        id
        name
        shortName
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
`;

const GET_POSITIONS = gql`
query {
  positions {
    positions {
      id
      name
      committee {
        id
        name
        shortName
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
`;

const GET_COMMITTEES_ARGS = gql`
query getCommittees($page: Int, $perPage: Int, $id: UUID, $short_name: String) {
  committees(page: $page, perPage: $perPage, filter: {id: $id, short_name: $short_name}) {
    committees {
      id
      name
      shortName
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
`;

const GET_COMMITTEES = gql`
query {
  committees {
    committees {
      id
      shortName
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
`;

const GET_MANDATES = gql`
query {
  mandatePagination {
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
`;

const GET_MANDATES_ARGS = gql`
query getMandates($page: Int, $perPage: Int, $id: UUID, $position_id: String, $member_id: UUID, $start_date: Date, $end_date: Date) {
  mandatePagination(page: $page, perPage: $perPage, filter: {id: $id, position_id: $position_id, member_id: $member_id, start_date: $start_date, end_date: $end_date}) {
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
`;

const member: Member = {
  id: '6034f5b1-692d-4d4f-ba34-34d9cab3c821',
  student_id: 'ab1234cd-s',
  first_name: 'Sven',
  last_name: 'Svensson',
  nickname: 'Bertil',
  class_programme: 'D',
  class_year: 1995,
};

const members: Member[] = [
  {
    id: '6034f5b1-692d-4d4f-ba34-34d9cab3c821',
    student_id: 'ab1234cd-s',
    first_name: 'Sven',
    last_name: 'Svensson',
    nickname: 'Bertil',
    class_programme: 'D',
    class_year: 1995,
  },
  {
    id: '6034f5b1-692d-4d4f-ba34-34d9cab3c822',
    student_id: 'ac3234cf-s',
    first_name: 'Stina',
    last_name: 'Karlsson',
    nickname: 'Per',
    class_programme: 'D',
    class_year: 1995,
  },
  {
    id: '6034f5b1-692d-4d4f-ba34-34d9cab3c823',
    student_id: 'jh3234cf-s',
    first_name: 'Lars',
    last_name: 'Karlsson',
    nickname: 'Per',
    class_programme: 'D',
    class_year: 1992,
  },
  {
    id: '6034f5b1-692d-4d4f-ba34-34d9cab3c824',
    student_id: 'gf3234cf-s',
    first_name: 'Pier',
    last_name: 'Leon',
    nickname: 'Peter',
    class_programme: 'C',
    class_year: 1996,
  },
];

const committees: Committee[] = [
  { id: '6034f5b1-692d-4d4f-ba34-34d9cab3c825', name: 'Informationsutskottet', shortName: 'infu' },
  { id: '6034f5b1-692d-4d4f-ba34-34d9cab3c826', name: 'Sexmästeriet', shortName: 'sexm' },
  { id: '6034f5b1-692d-4d4f-ba34-34d9cab3c827', name: 'Studierådet', shortName: 'srd' },
];

const positions: Position[] = [
  { id: 'dsek.infu.fotograf', name: 'Fotograf' },
  { id: 'dsek.sex.kok.mastare', name: 'Köksmästare' },
  { id: 'dsek.srd.mastare', name: 'Studierådordförande' },
  { id: 'dsek.talman', name: 'Talman' },
  { id: 'dsek.infu.artist', name: 'Artist' },
];

const positionsWithCommittees = [
  { ...positions[0], committee: committees[0] },
  { ...positions[1], committee: committees[1] },
  { ...positions[2], committee: committees[2] },
  { ...positions[3], committee: null },
  { ...positions[4], committee: committees[0] },
];

const mandates: FastMandate[] = [
  {
    id: 'ec65583b-1a21-4dbf-a661-4a68bc49e9b8',
    start_date: new Date('2021-01-01 00:00:00'),
    end_date: new Date('2022-01-01 00:00:00'),
    position: { id: 'dsek.infu.fotograf' },
    member: { id: '6034f5b1-692d-4d4f-ba34-34d9cab3c821' },
  },
  {
    id: 'ec65583b-1a21-4dbf-a661-4a68bc49e9b8',
    start_date: new Date('2021-02-01 00:00:00'),
    end_date: new Date('2021-06-01 00:00:00'),
    position: { id: 'dsek.infu.fotograf' },
    member: { id: '6034f5b1-692d-4d4f-ba34-34d9cab3c822' },
  },
  {
    id: 'ec65583b-1a21-4dbf-a661-4a68bc49e9b8',
    start_date: new Date('2021-03-01 00:00:00'),
    end_date: new Date('2021-03-31 00:00:00'),
    position: { id: 'dsek.infu.artist' },
    member: { id: '6034f5b1-692d-4d4f-ba34-34d9cab3c823' },
  },
];

const pageInfo: PaginationInfo = {
  totalPages: 1,
  totalItems: 10,
  page: 0,
  perPage: 5,
  hasNextPage: false,
  hasPreviousPage: false,
};

const memberPagination: MemberPagination = {
  members,
  pageInfo: {
    ...pageInfo,
    totalItems: members.length,
  },
};

const committeePagination: CommitteePagination = {
  committees,
  pageInfo: {
    ...pageInfo,
    totalItems: committees.length,
  },
};

const positionPagination = {
  positions: positionsWithCommittees,
  pageInfo: {
    ...pageInfo,
    totalItems: positionsWithCommittees.length,
  },
};

const mandatePagination: MandatePagination = {
  mandates,
  pageInfo: {
    ...pageInfo,
    totalItems: mandates.length,
  },
};

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
  });

  beforeEach(() => {
    sandbox.on(dataSources.memberAPI, 'getMember', (_, identifier) =>
      Promise.resolve(members
        .filter((m) =>
          (!identifier.id || identifier.id === m.id)
          && (!identifier.student_id || identifier.student_id === m.student_id))[0]));

    sandbox.on(dataSources.memberAPI, 'getMembers', (_, __, ___, filter) => {
      const filteredMembers = members.filter((m) =>
        !filter || ((!filter.id || filter.id === m.id)
          && (!filter.student_id || filter.student_id === m.student_id)
          && (!filter.first_name || filter.first_name === m.first_name)
          && (!filter.nickname || filter.nickname === m.nickname)
          && (!filter.last_name || filter.last_name === m.last_name)
          && (!filter.class_programme || filter.class_programme === m.class_programme)
          && (!filter.class_year || filter.class_year === m.class_year)));

      return Promise.resolve({
        members: filteredMembers,
        pageInfo: {
          ...pageInfo,
          totalItems: filteredMembers.length,
        },
      });
    });
    sandbox.on(dataSources.positionAPI, 'getPosition', (context, identifier) => {
      const position = positions.filter((p) => identifier.id === p.id)[0];
      return Promise.resolve(position);
    });
    sandbox.on(dataSources.positionAPI, 'getPositions', (context, page, perPage, filter) => {
      const filteredPositions = positionsWithCommittees.filter((p) =>
        !filter || ((!filter.id || filter.id === p.id) && (!filter.name || filter.name === p.name)
          && (!filter.committee_id || filter.committee_id === p.committee?.id)
           && (!filter.committee_short_name)));
      return Promise.resolve({
        positions: filteredPositions,
        pageInfo: {
          ...pageInfo,
          totalItems: filteredPositions.length,
        },
      });
    });
    sandbox.on(dataSources.committeeAPI, 'getCommitteeFromPositionId', (context, id: string) => Promise.resolve(positionsWithCommittees.find((p) => p.id === id)?.committee));
    sandbox.on(dataSources.committeeAPI, 'getCommittee', (context, identifier) => {
      if (!identifier.id) return null;
      const committee = committees.filter((c) =>
        (!identifier.id || identifier.id === c.id))[0];
      return Promise.resolve(committee);
    });
    sandbox.on(dataSources.committeeAPI, 'getCommittees', (context, page, perPage, filter) => {
      const filteredCommittees = committees.filter((p) =>
        !filter || ((!filter.id || filter.id === p.id)
          && (!filter.shortName || filter.shortName === p.shortName)));

      return Promise.resolve({
        committees: filteredCommittees,
        pageInfo: {
          ...pageInfo,
          totalItems: filteredCommittees.length,
        },
      });
    });
    sandbox.on(dataSources.mandateAPI, 'getMandates', (context, page, perPage, filter) => {
      const FilteredMandates: any = mandates.filter((m) =>
        !filter || ((!filter.id || filter.id === m.id)
          && (!filter.position_id || filter.position_id === m.position?.id)
          && (!filter.member_id || filter.member_id === m.member?.id)
          && (!filter.start_date || filter.start_date <= m.start_date)
          && (!filter.end_date || m.start_date <= filter.end_date)));
      const populatedMandates: FastMandate[] = FilteredMandates.map((m: FastMandate) => ({
        ...m,
        // member: members.find((mem) => mem.id === m.member?.id),
        // position: positions.find((p) => p.id === m.position?.id),
      }
      ));
      return Promise.resolve({
        mandates: populatedMandates,
        pageInfo: {
          ...pageInfo,
          totalItems: FilteredMandates.length,
        },
      });
    });
    sandbox.on(dataSources.accessAPI, 'withAccess', (name, context, fn) => fn());
    sandbox.on(dataSources.committeeAPI, 'withAccess', (name, context, fn) => fn());
    sandbox.on(dataSources.mandateAPI, 'withAccess', (name, context, fn) => fn());
    sandbox.on(dataSources.memberAPI, 'withAccess', (name, context, fn) => fn());
    sandbox.on(dataSources.positionAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('[me]', () => {
    it('returns signed in user', async () => {
      const { server: tmpServer, dataSources: tmpDataSources } = constructTestServer({ user: { keycloak_id: 'kc_1' } });
      const { query } = createTestClient(tmpServer);
      sandbox.on(tmpDataSources.memberAPI, 'getMemberFromKeycloakId', () => Promise.resolve(member));

      const { data } = await query({ query: GET_ME });
      expect(data).to.deep.equal({ me: member });
    });

    it('returns null on no user', async () => {
      const { data } = await client.query({ query: GET_ME });
      expect(data).to.deep.equal({ me: null });
    });
  });

  describe('[member]', () => {
    it('gets member with id', async () => {
      const input = { id: '6034f5b1-692d-4d4f-ba34-34d9cab3c821', student_id: undefined };
      const { data } = await client.query({ query: GET_MEMBER_ID, variables: input });
      expect(dataSources.memberAPI.getMember).to.have.been.called.with(input);
      expect(data).to.deep.equal({ member });
    });

    it('gets member with student_id', async () => {
      const input = { student_id: 'ab1234cd-s', id: undefined };
      const { data } = await client.query({ query: GET_MEMBER_STUDENT_ID, variables: input });
      expect(dataSources.memberAPI.getMember).to.have.been.called.with(input);
      expect(data).to.deep.equal({ member });
    });
  });

  describe('[members]', () => {
    it('gets all members', async () => {
      const { data } = await client.query({ query: GET_MEMBERS });
      expect(dataSources.memberAPI.getMembers).to.have.been.called();
      expect(data).to.deep.equal({ members: memberPagination });
    });

    it('gets members using filter', async () => {
      const filter: MemberFilter = {
        class_year: 1995,
      };
      const { data } = await client.query({ query: GET_MEMBERS_ARGS, variables: filter });
      expect(dataSources.memberAPI.getMembers).to.have.been.called.with(filter);
      const filtered = [members[0], members[1]];
      const expected = {
        members: filtered,
        pageInfo: {
          ...pageInfo,
          totalItems: filtered.length,
        },
      };
      expect(data).to.deep.equal({ members: expected });
    });
  });

  describe('[positions]', () => {
    it('gets positions with committees', async () => {
      const { data } = await client.query({ query: GET_POSITIONS });
      expect(dataSources.positionAPI.getPositions).to.have.been.called.exactly(1);
      expect(dataSources.committeeAPI.getCommittee).to.have.been.called.exactly(positions.length);
      expect(data).to.deep.equal({ positions: positionPagination });
    });

    it('gets positions using filter', async () => {
      const { data } = await client.query({ query: GET_POSITIONS_ARGS, variables: { committee_id: '6034f5b1-692d-4d4f-ba34-34d9cab3c825' } });
      const filtered = [positionsWithCommittees[0], positionsWithCommittees[4]];
      const expected = {
        positions: filtered,
        pageInfo: {
          ...pageInfo,
          totalItems: filtered.length,
        },
      };
      expect(dataSources.positionAPI.getPositions).to.have.been.called();
      expect(data).to.deep.equal({ positions: expected });
    });

    it('gets no position on no match', async () => {
      const { data } = await client.query({ query: GET_POSITIONS_ARGS, variables: { page: 0, perPage: 10, id: 'dsek.missing' } });
      const expected = {
        positions: [],
        pageInfo: {
          ...pageInfo,
          totalItems: 0,
        },
      };
      expect(data, `${JSON.stringify(data)} did not equal ${JSON.stringify(expected)}`).to.deep.equal({ positions: expected });
    });
  });

  describe('[committees]', () => {
    it('get committees', async () => {
      const { data } = await client.query({ query: GET_COMMITTEES });
      expect(data).to.deep.equal({ committees: committeePagination });
    });

    it('gets committees using filter', async () => {
      const variables = { page: 0, perPage: 10, id: '6034f5b1-692d-4d4f-ba34-34d9cab3c825' };
      const { data, errors } = await client.query({ query: GET_COMMITTEES_ARGS, variables });
      expect(errors, `${JSON.stringify(errors)} did not equal ${JSON.stringify(undefined)}`).to.be.undefined;
      const filtered = [committees[0]];
      const expected = {
        committees: filtered,
        pageInfo: {
          ...pageInfo,
          totalItems: filtered.length,
        },
      };
      expect(data).to.deep.equal({ committees: expected });
    });

    it('gets no position on no match', async () => {
      const variables = { page: 0, perPage: 10, id: '6034f5b1-692d-4d4f-ba34-34d9cab3c812' };
      const { data } = await client.query({ query: GET_COMMITTEES_ARGS, variables });
      const expected = {
        committees: [],
        pageInfo: {
          ...pageInfo,
          totalItems: 0,
        },
      };
      expect(data).to.deep.equal({ committees: expected });
    });
  });

  describe('[mandates]', () => {
    it('gets all mandates', async () => {
      const variables = { page: 0, perPage: 10 };
      const { data } = await client.query({ query: GET_MANDATES, variables });
      expect(dataSources.mandateAPI.getMandates).to.have.been.called();
      expect(data).to.deep.equal({ mandatePagination });
    });

    it('gets mandates using filter with position_id', async () => {
      const variables = {
        page: 1,
        perPage: 10,
        position_id: 'dsek.infu.fotograf',
      };
      const { data } = await client.query({ query: GET_MANDATES_ARGS, variables });
      const filtered = [mandates[0], mandates[1]];
      const expected: MandatePagination = {
        mandates: filtered,
        pageInfo: {
          ...pageInfo,
          totalItems: filtered.length,
        },
      };
      expect(dataSources.mandateAPI.getMandates).to.have.been.called.with(variables.page);
      expect(dataSources.mandateAPI.getMandates).to.have.been.called.with(variables.perPage);
      expect(dataSources.mandateAPI.getMandates).to.have.been.called.with({
        position_id: variables.position_id,
      });
      expect(data).to.deep.equal({ mandatePagination: expected });
    });

    it('gets mandates using filter with dates', async () => {
      const variables = {
        page: 1,
        perPage: 10,
        start_date: new Date('2021-02-15 00:00:00'),
        end_date: new Date('2021-03-15 00:00:00'),
      };
      const { data } = await client.query({ query: GET_MANDATES_ARGS, variables });
      const filtered = [mandates[2]];
      const expected: MandatePagination = {
        mandates: filtered,
        pageInfo: {
          ...pageInfo,
          totalItems: filtered.length,
        },
      };
      expect(dataSources.mandateAPI.getMandates).to.have.been.called();
      expect(data).to.deep.equal({ mandatePagination: expected });
    });

    it('gets mandates using filter with dates and position_id', async () => {
      const variables = {
        page: 1,
        perPage: 10,
        position_id: 'dsek.infu.fotograf',
        start_date: new Date('2021-01-15 00:00:00'),
      };
      const { data } = await client.query({ query: GET_MANDATES_ARGS, variables });
      const filtered = [mandates[1]];
      const expected: MandatePagination = {
        mandates: filtered,
        pageInfo: {
          ...pageInfo,
          totalItems: filtered.length,
        },
      };
      expect(dataSources.mandateAPI.getMandates).to.have.been.called();
      expect(data).to.deep.equal({ mandatePagination: expected });
    });
  });
});
