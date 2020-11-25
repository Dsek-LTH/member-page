import 'mocha';
import chai, { expect, assert } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { Song } from '../src/types/graphql';
import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const GET_SONGS = gql`
query {
  songs {
    id
    name
    lyrics
    writer
    category
    melody
    created
    edited
  }
}
`
const song: Song = {
  id: 1,
  name: "En gång i månan",
  lyrics: `En gång i månan är månen full
Aldrig jag sett honom ramla omkull
Stum av beundran hur mycket han tål
Höjer jag glaset och utbringar SKÅL!`,
  writer: { },
  category: 'Bordsvisor',
  melody: 'Mors lilla Olle',
  created: 123451234,
  edited: 123451235
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
    sandbox.on(dataSources.songAPI, 'function', (filter) => {
      return new Promise(resolve => resolve([song]))
    })
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[songs]', () => {

    it('it does something', async () => {
      const { data } = await client.query({query: GET_SONGS})
      expect(data).to.deep.equal([song]);
    })
  })
})