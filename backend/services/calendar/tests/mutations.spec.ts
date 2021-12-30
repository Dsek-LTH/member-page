import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { DataSources } from '../src/datasources';
import constructTestServer from './util';
import { Event } from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const CREATE_EVENT = gql`
  mutation createEvent {
    event {
      create(
        input: {
          title: "Nytt dsek event"
          description: "Skapat på ett väldigt bra sätt"
          short_description: "Skapat"
          link: "www.dsek.se"
          location: "iDét"
          organizer: "DWWW"
          start_datetime: "2021-03-31 19:30:02"
          end_datetime: "2021-04-01 19:30:02"
        }
      ) {
        id
        title
        description
        short_description
        link
        location
        organizer
        start_datetime
        end_datetime
        number_of_updates
        author {
          id
        }
      }
    }
  }
`;
const UPDATE_EVENT = gql`
  mutation updateEvent {
    event {
      update(id: 1, input: { description: "Uppdaterat" }) {
        id
        title
        description
        short_description
        link
        location
        organizer
        start_datetime
        end_datetime
        number_of_updates
        author {
          id
        }
      }
    }
  }
`;
const REMOVE_EVENT = gql`
  mutation removeEvent {
    event {
      remove(id: 1) {
        id
        title
        description
        short_description
        link
        location
        organizer
        start_datetime
        end_datetime
        number_of_updates
        author {
          id
        }
      }
    }
  }
`;
const event: Event = {
  id: 1,
  author: { id: 1 },
  title: 'Nytt dsek event',
  description: 'Skapat på ett väldigt bra sätt',
  short_description: 'Skapat',
  link: 'www.dsek.se',
  location: 'iDét',
  organizer: 'DWWW',
  start_datetime: '2021-03-31 19:30:02',
  end_datetime: '2021-04-01 19:30:02',
  number_of_updates: 0,
};

describe('[Mutations]', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(() => {
    const testServer = constructTestServer({ user: { keycloak_id: 'kc_1' } });
    server = testServer.server;
    dataSources = testServer.dataSources;

    const c = createTestClient(server);
    client = c;
  });

  beforeEach(() => {
    sandbox.on(
      dataSources.eventAPI,
      'createEvent',
      () => Promise.resolve(event),
    );
    sandbox.on(
      dataSources.eventAPI,
      'updateEvent',
      () => Promise.resolve(event),
    );
    sandbox.on(
      dataSources.eventAPI,
      'removeEvent',
      () => Promise.resolve(event),
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('[event]', () => {
    it('creates an event', async () => {
      const { data } = await client.mutate({ mutation: CREATE_EVENT });
      expect(data.event.create).to.deep.equal(event);
    });

    it('updates an event', async () => {
      const { data } = await client.mutate({ mutation: UPDATE_EVENT });
      expect(data.event.update).to.deep.equal(event);
    });

    it('removes a member', async () => {
      const { data } = await client.mutate({ mutation: REMOVE_EVENT });
      expect(data.event.remove).to.deep.equal(event);
    });
  });
});
