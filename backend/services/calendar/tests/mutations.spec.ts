import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';
import { Event } from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();


const CREATE_EVENT = gql`
mutation createEvent {
  event {
    create(input: { title: "Nytt dsek event", description: "Skapat", link: "www.dsek.se", start_datetime: "2021-03-31 19:30:02", end_datetime: "2021-04-01 19:30:02"}) {
        id
        title
        description
        link
        start_datetime
        end_datetime
    }
  }
}
`
const UPDATE_EVENT = gql`
mutation updateEvent {
  event {
    update(id: 1, input: { description: "Uppdaterat" }) {
        id
        title
        description
        link
        start_datetime
        end_datetime
    }
  }
}
`
const REMOVE_EVENT = gql`
mutation removeEvent {
  event {
    remove(id: 1) {
        id
        title
        description
        link
        start_datetime
        end_datetime
    }
  }
}
`
const event: Event = {
    id: 1,
    title: "Nytt dsek event",
    description: "Skapat",
    link: "www.dsek.se",
    start_datetime: "2021-03-31 19:30:02",
    end_datetime: "2021-04-01 19:30:02",
}

describe('[Mutations]', () => {
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
      sandbox.on(dataSources.eventAPI, 'createEvent', (input) => new Promise(resolve => resolve(event)))
      sandbox.on(dataSources.eventAPI, 'updateEvent', (id, input) => new Promise(resolve => resolve(event)))
      sandbox.on(dataSources.eventAPI, 'removeEvent', (id) => new Promise(resolve => resolve(event)))
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[event]', () => {

    it('creates an event throws error when user is not signed in', async () => {
      const { errors } = await client.mutate({ mutation: CREATE_EVENT });
      expect(errors).to.exist
    })

    it('creates an event', async () => {
      const { server, dataSources } = constructTestServer({user: {keycloak_id: 'kc_1'}});
      const { mutate } = createTestClient(server);
      sandbox.on(dataSources.eventAPI, 'createEvent', (input) => new Promise(resolve => resolve(event)));
      const { data } = await mutate({ mutation: CREATE_EVENT });
      expect(data.event.create).to.deep.equal(event);
    })

    it('updates an event throws error when user is not signed in', async () => {
      const { errors } = await client.mutate({ mutation: UPDATE_EVENT });
      expect(errors).to.exist
    })

    it('updates an event', async () => {
      const { server, dataSources } = constructTestServer({user: {keycloak_id: 'kc_1'}});
      const { mutate } = createTestClient(server);
      sandbox.on(dataSources.eventAPI, 'updateEvent', (input) => new Promise(resolve => resolve(event)));
      const { data } = await mutate({ mutation: UPDATE_EVENT });
      expect(data.event.update).to.deep.equal(event);
    })

    it('removes an event throws error when user is not signed in', async () => {
      const { errors } = await client.mutate({ mutation: REMOVE_EVENT });
      expect(errors).to.exist
    })

    it('removes a member', async () => {
      const { server, dataSources } = constructTestServer({user: {keycloak_id: 'kc_1'}});
      const { mutate } = createTestClient(server);
      sandbox.on(dataSources.eventAPI, 'removeEvent', (input) => new Promise(resolve => resolve(event)));
      const { data } = await mutate({ mutation: REMOVE_EVENT });
      expect(data.event.remove).to.deep.equal(event);
    })

  })
})