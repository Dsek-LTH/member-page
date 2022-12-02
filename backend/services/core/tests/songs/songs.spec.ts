import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer } from 'apollo-server';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';

import { DataSources } from '~/src/datasources';
import constructTestServer from '../util';
import { Song } from '~/src/types/songs';
import { knex } from '~/src/shared';
import {
  GetSongById, GetSongByTitleQuery, GetSongsQuery, songs,
} from './songsData';

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Song API Graphql Queries', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(() => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;
    client = createTestClient(server);
    sandbox.on(dataSources.songAPI, 'withAccess', (name, context, fn) => fn());
  });

  beforeEach(async () => {
    await knex<Song>('songs').insert(songs);
  });

  afterEach(async () => {
    await knex<Song>('songs').del();
  });

  describe(('songs'), () => {
    it('should return all songs', async () => {
      chai.spy.on(dataSources.songAPI, 'songs');
      const { data, errors } = await client.query({
        query: GetSongsQuery,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data?.songs, `${JSON.stringify(data?.songs)}`).to.deep.equal(songs);
      expect(dataSources.songAPI.songs).to.have.been.called();
    });
  });

  describe(('songByTitle'), () => {
    it('should return a song by its title', async () => {
      chai.spy.on(dataSources.songAPI, 'songByTitle');
      const { data, errors } = await client.query({
        query: GetSongByTitleQuery,
        variables: {
          title: songs[0].title,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data?.songByTitle, `${JSON.stringify(data)}`).to.deep.equal(songs[0]);
      expect(dataSources.songAPI.songByTitle).to.have.been.called();
    });
  });

  describe(('songById'), () => {
    it('should return a song by its title', async () => {
      chai.spy.on(dataSources.songAPI, 'songById');
      const { data, errors } = await client.query({
        query: GetSongById,
        variables: {
          id: songs[0].id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data?.songById, `${JSON.stringify(data)}`).to.deep.equal(songs[0]);
      expect(dataSources.songAPI.songById).to.have.been.called();
    });
  });
});
