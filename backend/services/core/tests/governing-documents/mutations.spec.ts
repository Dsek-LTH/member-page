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
import {
  CreateGoverningDocument,
} from './gqlMutations';
import { GoverningDocument } from '~/src/types/governingDocuments';
import * as gql from '~/src/types/graphql';

const ctx = { user: undefined, roles: undefined };

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Mail API Graphql Queries', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(async () => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;
    client = createTestClient(server);
    sandbox.on(dataSources.governingDocumentsAPI, 'withAccess', (name, context, fn) => fn());
    // await knex<GoverningDocument>('governing_documents').insert(aliases);
  });

  afterEach(() => {
    chai.spy.restore(dataSources.mailAPI);
    sandbox.restore();
    sandbox.on(dataSources.mailAPI, 'withAccess', (name, context, fn) => fn());
  });

  after(async () => {
    sandbox.restore();
    chai.spy.restore(dataSources.mailAPI);
    await knex<GoverningDocument>('governing_documents').del();
  });

  describe(('CreateGoverningDocument'), () => {
    it('creates a governing document', async () => {
      chai.spy.on(dataSources.governingDocumentsAPI, 'createGoverningDocument');
      const variables = {
        title: 'test',
        url: 'url',
        type: gql.GoverningDocumentType.Policy,
      };
      const { data, errors } = await client.mutate({
        mutation: CreateGoverningDocument,
        variables,
      });
      expect(dataSources.governingDocumentsAPI.createGoverningDocument).to.be.called
        .with(ctx, variables);
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.governingDocument.create, `${JSON.stringify(data)}`).to.deep.equal(variables);
    });
  });
});
