import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';

import { Event, EventFilter } from '~/src/types/graphql';
import { DataSources } from '~/src/datasources';
import constructTestServer from '../util';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const GET_EVENT = gql`
  query getEvent($id: UUID!) {
    event(id: $id) {
      id
      title
      description
      location
      organizer
      short_description
      link
      start_datetime
      end_datetime
      number_of_updates
      author {
        id
      }
      iAmInterested
      iAmGoing
      peopleGoing {
        id
        student_id
        first_name
        last_name
        nickname
        picture_path
      }
      peopleInterested {
        id
        student_id
        first_name
        last_name
        nickname
        picture_path
      }
    }
  }
`;

const GET_EVENTS = gql`
  query {
    events {
      events {
        id
        title
        description
        link
        location
        organizer
        short_description
        start_datetime
        end_datetime
        number_of_updates
        author {
          id
        }
        iAmInterested
        iAmGoing
        peopleGoing {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
        }
        peopleInterested {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
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

const GET_EVENTS_ARGS = gql`
  query getEvents(
    $page: Int
    $perPage: Int
    $id: UUID
    $start_datetime: Datetime
    $end_datetime: Datetime
  ) {
    events(
      page: $page,
      perPage: $perPage
      filter: {
        id: $id
        start_datetime: $start_datetime
        end_datetime: $end_datetime
      }
    ) {
      events {
        id
        title
        description
        link
        location
        organizer
        short_description
        start_datetime
        end_datetime
        number_of_updates
        author {
          id
        }
        iAmInterested
        iAmGoing
        peopleGoing {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
        }
        peopleInterested {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
        }
      }
      pageInfo {
        totalItems
      }
    }
  }
`;

const events: Event[] = [
  {
    id: 'bb420339-ff78-4568-a8fa-c98478bcb329',
    author: { id: '11e9081c-c68d-4bea-8090-7a812d1dcfda' },
    title: 'Nytt dsek event',
    description: 'Skapat på ett väldigt bra sätt',
    short_description: 'Skapat',
    link: 'www.dsek.se',
    start_datetime: '2021-03-31 19:30:02',
    end_datetime: '2021-04-01 19:30:02',
    location: 'iDét',
    organizer: 'DWWW',
    number_of_updates: 0,
    peopleGoing: [],
    peopleInterested: [],
    iAmGoing: false,
    iAmInterested: false,
  },
  {
    id: 'bb420339-ff78-4568-a8fa-c98478bcb322',
    author: { id: '11e9081c-c68d-4bea-8090-7a812d1dcfda' },
    title: 'Dsek lanserar den nya hemsidan',
    description: 'Bästa hemsidan',
    short_description: 'Bästa',
    link: 'www.dsek.se',
    start_datetime: '2021-03-31 19:30:02',
    end_datetime: '2021-12-31 19:30:02',
    location: 'Kåraulan',
    organizer: 'D-Sektionen',
    number_of_updates: 0,
    peopleGoing: [],
    peopleInterested: [],
    iAmGoing: false,
    iAmInterested: false,
  },
  {
    id: 'bb420339-ff78-4568-a8fa-c98478bcb323',
    author: { id: '11e9081c-c68d-4bea-8090-7a812d1dcfda' },
    title: 'Proggkväll med dsek',
    description: 'Koda koda koda',
    short_description: 'Koda',
    link: '',
    start_datetime: '2020-01-30 19:30:02',
    end_datetime: '2021-04-01 20:30:02',
    location: 'Jupiter',
    organizer: 'dsek',
    number_of_updates: 0,
    peopleGoing: [],
    peopleInterested: [],
    iAmGoing: false,
    iAmInterested: false,
  },
];

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
    sandbox.on(dataSources.eventAPI, 'getEvent', (_, id) => Promise.resolve(events.find((e) => e.id === id)));
    sandbox.on(dataSources.eventAPI, 'getEvents', (_, page, perPage, filter) => {
      let filteredEvents = events;
      if (filter?.start_datetime) {
        const filterStartTime = new Date(filter.start_datetime).getTime();
        filteredEvents = filteredEvents.filter(
          (event) => filterStartTime < new Date(event.start_datetime).getTime(),
        );
      }
      if (filter?.end_datetime) {
        const filterEndTime = new Date(filter.end_datetime).getTime();
        filteredEvents = filteredEvents.filter(
          (event) => filterEndTime > new Date(event.end_datetime).getTime(),
        );
      }
      if (page !== undefined && perPage !== undefined) {
        return Promise.resolve({
          events: filteredEvents,
          pageInfo: {
            totalItems: filteredEvents.length,
          },
        });
      }
      return Promise.resolve({ events: filteredEvents });
    });
    sandbox.on(dataSources.eventAPI, 'getPeopleComing', (_, id) => Promise.resolve(events.find((e) => e.id === id)?.peopleGoing ?? []));
    sandbox.on(dataSources.eventAPI, 'getPeopleInterested', (_, id) => Promise.resolve(events.find((e) => e.id === id)?.peopleInterested ?? []));
    sandbox.on(dataSources.eventAPI, 'userIsGoing', () => Promise.resolve(false));
    sandbox.on(dataSources.eventAPI, 'userIsInterested', () => Promise.resolve(false));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('[event]', () => {
    it('gets event with id', async () => {
      const input = { id: 'bb420339-ff78-4568-a8fa-c98478bcb329' };
      const { data, errors } = await client.query({
        query: GET_EVENT,
        variables: input,
      });
      expect(errors, `GRAPHQL Errors: ${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.eventAPI.getEvent).to.have.been.called.once;
      expect(dataSources.eventAPI.getEvent).to.have.been.called.with(input.id);
      expect(data).to.deep.equal({ event: events[0] });
    });
  });

  describe('[events]', () => {
    it('gets all events', async () => {
      const { data, errors } = await client.query({
        query: GET_EVENTS,
        variables: { filter: {} },
      });
      expect(errors, `GRAPHQL Errors: ${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.events.events).to.deep.equal(events);
    });

    it('gets events using filter', async () => {
      const filter: EventFilter = { start_datetime: '2021-03-27 19:30:02' };
      const { data, errors } = await client.query({
        query: GET_EVENTS_ARGS,
        variables: { page: 0, perPage: 10, start_datetime: filter.start_datetime },
      });
      expect(errors, `GRAPHQL Errors: ${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.eventAPI.getEvents).to.have.been.called.with(filter);
      expect(data.events).to.deep.equal({
        events: [events[0], events[1]],
        pageInfo: { totalItems: 2 },
      });
    });
  });
});
