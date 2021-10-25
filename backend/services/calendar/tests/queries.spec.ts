import 'mocha';
import chai, { expect, assert } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { Event, EventFilter } from '../src/types/graphql';
import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';

chai.use(spies);
const sandbox = chai.spy.sandbox();


const GET_EVENT = gql`
query getEvent($id: Int!) {
  event(id: $id) {
    id
    title
    description
    link
    start_datetime
    end_datetime
  }
}
`

const GET_EVENTS = gql`
query {
  events {
    id
    title
    description
    link
    start_datetime
    end_datetime
  }
}
`

const GET_EVENTS_ARGS = gql`
query getEvents($id: Int, $start_datetime: Datetime, $end_datetime: Datetime){
  events(filter: {id: $id, start_datetime: $start_datetime, end_datetime: $end_datetime}) {
    id
    title
    description
    link
    start_datetime
    end_datetime
  }
}
`

const events: Event[] = [
  {
    id: 1,
    title: 'event 1',
    description: 'description 1',
    link: "www.e1.se",
    start_datetime: "2021-03-27 19:30:02",
    end_datetime: "2021-03-27 20:30:02"
  },
  {
    id: 2,
    title: 'event 2',
    description: 'description 2',
    link: "www.e2.se",
    start_datetime: "2021-03-27 19:30:02",
    end_datetime: "2021-03-28 19:30:02"
  },
  {
    id: 3,
    title: 'event 3',
    description: 'description 3',
    link: "www.e3.se",
    start_datetime: "2020-03-27 19:30:02",
    end_datetime: "2021-03-27 19:30:02"
  },
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
    sandbox.on(dataSources.eventAPI, 'getEvent', (context, id) => {
      return new Promise(resolve => resolve(events.find(e => e.id == id)))
    })
    sandbox.on(dataSources.eventAPI, 'getEvents', (context, filter) => {
      return new Promise(resolve => resolve(events.filter((e) =>
        !filter || (!filter.id || filter.id === e.id) && (!filter.title || filter.title === e.title)
        && (!filter.description || filter.description === e.description) && (!filter.link || filter.link === e.link)
        && (!filter.start_datetime || filter.start_datetime === e.start_datetime) && (!filter.end_datetime || filter.end_datetime === e.end_datetime)
       )))
    })
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[event]', () => {

    it('gets event with id', async () => {
      const input = { id: 1 }
      const { data } = await client.query({query: GET_EVENT, variables: input })
      expect(dataSources.eventAPI.getEvent).to.have.been.called.once;
      expect(dataSources.eventAPI.getEvent).to.have.been.called.with(input.id);
      expect(data).to.deep.equal({ event: events[0] })
    })

  })

  describe('[events]', () => {

    it('gets all events', async () => {
      const { data } = await client.query({query: GET_EVENTS, variables: { }})
      expect(data).to.deep.equal({ events })
    })

    it('gets events using filter', async () => {
      const filter: EventFilter = { start_datetime: "2021-03-27 19:30:02" }
      const { data } = await client.query({query: GET_EVENTS_ARGS, variables: filter })
      expect(dataSources.eventAPI.getEvents).to.have.been.called.with( filter );
      expect(data).to.deep.equal({ events: [events[0], events[1]] })
    })

  })

})