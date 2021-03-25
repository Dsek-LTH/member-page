import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const CREATE_POSITION = gql`
mutation createPosition {
  position {
    create(input: {name: "Fotograf", committee_id: 2})
  }
}
`
const UPDATE_POSITION = gql`
mutation updatePosition {
  position {
    update(id: 1, input: {name: "Fotograf", committee_id: 2})
  }
}
`
const REMOVE_POSITION = gql`
mutation removePosition {
  position {
    remove(id: 1)
  }
}
`
const CREATE_COMMITTEE = gql`
mutation createCommittee {
  committee {
    create(input: {name: "Informationsutskottet"})
  }
}
`
const UPDATE_COMMITTEE = gql`
mutation updateCommittee {
  committee {
    update(id: 1, input: {name: "Studierådet"})
  }
}
`
const REMOVE_COMMITTEE = gql`
mutation removeCommittee {
  committee {
    remove(id: 1)
  }
}
`

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
    // Due to an error in @types/chai-spies ts-ignore is necessary.
    // Pull request solving the issue https://github.com/DefinitelyTyped/DefinitelyTyped/pull/49678§
    // @ts-ignore
    sandbox.on(dataSources.positionAPI, 'createPosition', (ctx, input) => new Promise(resolve => resolve(input.name ? true : false)))
    // @ts-ignore
    sandbox.on(dataSources.positionAPI, 'updatePosition', (ctx, id, input) => new Promise(resolve => resolve(id ? true : false)))
    // @ts-ignore
    sandbox.on(dataSources.positionAPI, 'removePosition', (ctx, id) => new Promise(resolve => resolve(id ? true : false)))
    // @ts-ignore
    sandbox.on(dataSources.committeeAPI, 'createCommittee', (ctx, input) => new Promise(resolve => resolve(input.name ? true : false)))
    // @ts-ignore
    sandbox.on(dataSources.committeeAPI, 'updateCommittee', (ctx, id, input) => new Promise(resolve => resolve(id ? true : false)))
    // @ts-ignore
    sandbox.on(dataSources.committeeAPI, 'removeCommittee', (ctx, id) => new Promise(resolve => resolve(id ? true : false)))
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[position]', () => {

    it('creates a position', async () => {
      const { data } = await client.mutate({mutation: CREATE_POSITION});
      expect(data.position.create).to.be.true;
    })

    it('updates a position', async () => {
      const { data } = await client.mutate({mutation: UPDATE_POSITION});
      expect(data.position.update).to.be.true;
    })

    it('removes a position', async () => {
      const { data } = await client.mutate({mutation: REMOVE_POSITION});
      expect(data.position.remove).to.be.true;
    })
  })

  describe('[committee]', () => {

    it('creates a committee', async () => {
      const { data } = await client.mutate({mutation: CREATE_COMMITTEE});
      expect(data.committee.create).to.be.true;
    })

    it('updates a committee', async () => {
      const { data } = await client.mutate({mutation: UPDATE_COMMITTEE});
      expect(data.committee.update).to.be.true;
    })

    it('removes a committee', async () => {
      const { data } = await client.mutate({mutation: REMOVE_COMMITTEE});
      expect(data.committee.remove).to.be.true;
    })
  })
})