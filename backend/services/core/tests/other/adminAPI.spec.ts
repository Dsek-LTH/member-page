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
import { knex } from '~/src/shared';
import deleteExistingEntries from '~/seeds/helpers/deleteExistingEntries';
import { SeedDatabaseQuery, SyncMandatesWithKeycloakQuery, UpdateSearchIndex } from './adminData';

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Admin API Graphql Queries', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(async () => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;
    client = createTestClient(server);
    sandbox.on(dataSources.adminAPI, 'withAccess', (name, context, fn) => fn());
    await deleteExistingEntries(knex);
  });

  after(async () => {
    await deleteExistingEntries(knex);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    chai.spy.restore(dataSources.adminAPI, 'seed');
  });

  describe(('seed'), () => {
    it('should successfully seed database', async function adminTest() {
      this.timeout(10000);
      chai.spy.on(dataSources.adminAPI, 'seed');
      const { data, errors } = await client.query({
        query: SeedDatabaseQuery,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data?.admin.seed, `${JSON.stringify(data?.songs)}`).to.be.true;
      expect(dataSources.adminAPI.seed).to.have.been.called();
    });

    it('should fail to seed if already seeded', async () => {
      chai.spy.on(dataSources.adminAPI, 'seed');
      const { data, errors } = await client.query({
        query: SeedDatabaseQuery,
      });
      if (errors?.length) {
        expect(errors[0].message, `${JSON.stringify(errors)}`).to.be.equal('Database is already seeded');
      } else {
        expect.fail('Should have thrown an error');
      }
      expect(data?.admin.seed, `${JSON.stringify(data?.songs)}`).to.be.null;
      expect(dataSources.adminAPI.seed).to.have.been.called();
    });

    it('should always succeed as admin on sandbox', async function seedAsSandbox() {
      process.env.SANDBOX = 'true';
      this.timeout(10000);
      chai.spy.on(dataSources.adminAPI, 'seed');
      const { data, errors } = await client.query({
        query: SeedDatabaseQuery,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data?.admin.seed, `${JSON.stringify(data?.admin.seed)}`).to.be.true;
      expect(dataSources.adminAPI.seed).to.have.been.called();
      process.env.SANDBOX = undefined;
      await deleteExistingEntries(knex);
    });

    it('should sync mandates with keycloak', async () => {
      chai.spy.on(dataSources.adminAPI, 'syncMandatesWithKeycloak');
      const { data, errors } = await client.query({
        query: SyncMandatesWithKeycloakQuery,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data?.admin.syncMandatesWithKeycloak, `${JSON.stringify(data?.admin.syncMandatesWithKeycloak)}`).to.be.true;
      expect(dataSources.adminAPI.syncMandatesWithKeycloak).to.have.been.called();
    });

    it('update search index', async () => {
      chai.spy.on(dataSources.adminAPI, 'updateSearchIndex');
      const { data, errors } = await client.query({
        query: UpdateSearchIndex,
      });
      if (errors?.length) {
        expect(errors[0].message, `${JSON.stringify(errors)}`).to.be.equal('Failed to update search index');
      } else {
        expect.fail('Should have thrown an error');
      }
      expect(data?.admin.updateSearchIndex, `${JSON.stringify(data?.admin.updateSearchIndex)}`).to.be.null;
      expect(dataSources.adminAPI.updateSearchIndex).to.have.been.called();
    });
  });
});
