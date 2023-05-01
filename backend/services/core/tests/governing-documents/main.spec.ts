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
  CreateGoverningDocument, DeleteGoverningDocument, UpdateGoverningDocument,
} from './gqlMutations';
import { GoverningDocument } from '~/src/types/governingDocuments';
import * as gql from '~/src/types/graphql';
import { governingDocuments, governingDocumentsGraphql } from './data';
import {
  GetGoverningDocument, GetGoverningDocuments, GetGuidelines, GetPolicies,
} from './gqlQueries';

const ctx = { user: undefined, roles: undefined };

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Governing Documents API Graphql Queries', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(async () => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;
    client = createTestClient(server);
    sandbox.on(dataSources.governingDocumentsAPI, 'withAccess', (name, context, fn) => fn());
    await knex<GoverningDocument>('governing_documents').insert(governingDocuments);
  });

  afterEach(async () => {
    chai.spy.restore(dataSources.governingDocumentsAPI);
    sandbox.restore();
    sandbox.on(dataSources.governingDocumentsAPI, 'withAccess', (name, context, fn) => fn());
    await knex<GoverningDocument>('governing_documents').del();
    await knex<GoverningDocument>('governing_documents').insert(governingDocuments);
  });

  after(async () => {
    sandbox.restore();
    chai.spy.restore(dataSources.governingDocumentsAPI);
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

  describe(('UpdateGoverningDocument'), () => {
    it('updates title only', async () => {
      chai.spy.on(dataSources.governingDocumentsAPI, 'updateGoverningDocument');
      const variables = {
        input: {
          id: governingDocuments[0].id,
          title: 'updated title',
        },
      };
      const { data, errors } = await client.mutate({
        mutation: UpdateGoverningDocument,
        variables,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.governingDocumentsAPI.updateGoverningDocument).to.be.called
        .with(ctx, variables.input);
      expect(data.governingDocument.update, `${JSON.stringify(data)}`).to.deep.equal({
        id: governingDocuments[0].id,
        title: variables.input.title,
        url: governingDocuments[0].url,
        type: governingDocuments[0].document_type,
      });
    });
    it('updates all fields in a governing document', async () => {
      chai.spy.on(dataSources.governingDocumentsAPI, 'updateGoverningDocument');
      const variables = {
        input: {
          id: governingDocuments[0].id,
          title: 'updated title',
          url: 'updated url',
          type: gql.GoverningDocumentType.Guideline,
        },
      };
      const { data, errors } = await client.mutate({
        mutation: UpdateGoverningDocument,
        variables,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.governingDocumentsAPI.updateGoverningDocument).to.be.called
        .with(ctx, variables.input);
      expect(data.governingDocument.update, `${JSON.stringify(data)}`).to.deep.equal(variables.input);
    });
  });

  describe(('DeleteGoverningDocument'), () => {
    it('deletes a governing document', async () => {
      const original = await knex<GoverningDocument>('governing_documents')
        .where('id', governingDocuments[0].id);
      expect(original[0].deleted_at).to.be.null;

      chai.spy.on(dataSources.governingDocumentsAPI, 'deleteGoverningDocument');
      const variables = {
        id: governingDocuments[0].id,
      };
      const { data, errors } = await client.mutate({
        mutation: DeleteGoverningDocument,
        variables,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.governingDocumentsAPI.deleteGoverningDocument).to.be.called
        .with(ctx, variables.id);
      expect(data.governingDocument.delete, `${JSON.stringify(data)}`).to.equal(true);

      const updated = await knex<GoverningDocument>('governing_documents')
        .where('id', variables.id)
        .first();
      expect(updated?.deleted_at).to.not.be.null;
    });
  });

  describe(('GetGoverningDocument'), () => {
    it('gets a governing document', async () => {
      chai.spy.on(dataSources.governingDocumentsAPI, 'getGoverningDocument');
      const variables = {
        id: governingDocuments[0].id,
      };
      const { data, errors } = await client.query({
        query: GetGoverningDocument,
        variables,
      });
      expect(dataSources.governingDocumentsAPI.getGoverningDocument).to.be.called
        .with(ctx, variables.id);
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.governingDocument, `${JSON.stringify(data)}`).to.deep.equal(governingDocumentsGraphql[0]);
    });
  });

  describe(('GetGoverningDocuments'), () => {
    it('gets governing documents', async () => {
      chai.spy.on(dataSources.governingDocumentsAPI, 'getGoverningDocuments');
      const { data, errors } = await client.query({
        query: GetGoverningDocuments,
      });
      expect(dataSources.governingDocumentsAPI.getGoverningDocuments).to.be.called
        .with(ctx);
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.governingDocuments, `${JSON.stringify(data)}`).to.deep.equal(governingDocumentsGraphql);
    });
  });

  describe(('GetPolicies'), () => {
    it('gets policies', async () => {
      chai.spy.on(dataSources.governingDocumentsAPI, 'getPolicies');
      const { data, errors } = await client.query({
        query: GetPolicies,
      });
      expect(dataSources.governingDocumentsAPI.getPolicies).to.be.called
        .with(ctx);
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.policies, `${JSON.stringify(data)}`).to.deep.equal(governingDocumentsGraphql.filter((gd) => gd.type === gql.GoverningDocumentType.Policy));
    });
  });

  describe(('GetGuidelines'), () => {
    it('gets guidelines', async () => {
      chai.spy.on(dataSources.governingDocumentsAPI, 'getGuidelines');
      const { data, errors } = await client.query({
        query: GetGuidelines,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.governingDocumentsAPI.getGuidelines).to.be.called
        .with(ctx);
      expect(data.guidelines, `${JSON.stringify(data)}`).to.deep.equal(governingDocumentsGraphql.filter((gd) => gd.type === gql.GoverningDocumentType.Guideline));
    });
  });
});
