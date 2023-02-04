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
import * as sql from '~/src/types/database';
import { specialReceivers, specialSenders } from './data';
import {
  CreateSpecialReceiverMutation,
  CreateSpecialSenderMutation,
  RemoveSpecialReceiverMutation,
  RemoveSpecialSenderMutation,
  SpecialReceiversQuery,
  SpecialSendersQuery,
} from './gqlQueries';

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
    sandbox.on(dataSources.mailAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(() => {
    chai.spy.restore(dataSources.mailAPI);
    sandbox.restore();
    sandbox.on(dataSources.mailAPI, 'withAccess', (name, context, fn) => fn());
  });

  after(async () => {
    sandbox.restore();
    chai.spy.restore(dataSources.mailAPI);
  });

  describe(('Special Senders'), () => {
    let idToRemove: string;
    before(async () => {
      await knex<sql.SpecialSender>('special_senders').insert(specialSenders);
    });
    after(async () => {
      await knex<sql.SpecialSender>('special_senders').del();
    });
    it('gets special senders for alias', async () => {
      chai.spy.on(dataSources.mailAPI, 'getSpecialSendersForAlias');
      const { data, errors } = await client.query({
        query: SpecialSendersQuery,
        variables: {
          alias: 'test@email.com',
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.mailAPI.getSpecialSendersForAlias).to.be.called
        .with(ctx, 'test@email.com');
      expect(data.specialSenders, `${JSON.stringify(data)}`).to.deep.equal([
        {
          id: specialSenders[0].id,
          studentId: specialSenders[0].student_id,
          keycloakId: specialSenders[0].keycloak_id,
        },
        {
          id: specialSenders[1].id,
          studentId: specialSenders[1].student_id,
          keycloakId: specialSenders[1].keycloak_id,
        },
      ]);
    });

    it('creates special sender', async () => {
      const input = {
        alias: 'test@mail.com',
        studentId: '1234',
        keycloakId: '5678',
      };
      chai.spy.on(dataSources.mailAPI, 'createSpecialSender');
      const { data, errors } = await client.mutate({
        mutation: CreateSpecialSenderMutation,
        variables: {
          input,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.mailAPI.createSpecialSender).to.be.called
        .with(ctx, input);
      expect(data.specialSender.create, `${JSON.stringify(data)}`).to.deep.equal({
        id: data.specialSender.create.id,
        keycloakId: input.keycloakId,
        studentId: input.studentId,
      });
      idToRemove = data.specialSender.create.id;
    });

    it('removes special sender', async () => {
      chai.spy.on(dataSources.mailAPI, 'removeSpecialSender');
      const { data, errors } = await client.mutate({
        mutation: RemoveSpecialSenderMutation,
        variables: {
          id: idToRemove,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.mailAPI.removeSpecialSender).to.be.called
        .with(ctx, idToRemove);
      expect(data.specialSender.remove, `${JSON.stringify(data)}`).to.deep.equal({
        id: idToRemove,
      });
    });
  });

  describe(('Special Receivers'), () => {
    let idToRemove: string;

    before(async () => {
      await knex<sql.SpecialReceiver>('special_receivers').insert(specialReceivers);
    });
    after(async () => {
      await knex<sql.SpecialReceiver>('special_receivers').del();
    });
    it('gets special receivers for alias', async () => {
      chai.spy.on(dataSources.mailAPI, 'getSpecialReceiversForAlias');
      const { data, errors } = await client.query({
        query: SpecialReceiversQuery,
        variables: {
          alias: 'test@email.com',
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.mailAPI.getSpecialReceiversForAlias).to.be.called
        .with(ctx, 'test@email.com');
      expect(data.specialReceivers, `${JSON.stringify(data)}`).to.deep.equal([
        {
          id: specialReceivers[0].id,
          targetEmail: specialReceivers[0].target_email,
        },
        {
          id: specialReceivers[1].id,
          targetEmail: specialReceivers[1].target_email,
        },
      ]);
    });

    it('creates special receiver', async () => {
      const input = {
        alias: 'test@mail.com',
        targetEmail: 'oliver@mail.com',
      };
      chai.spy.on(dataSources.mailAPI, 'createSpecialReceiver');
      const { data, errors } = await client.mutate({
        mutation: CreateSpecialReceiverMutation,
        variables: {
          input,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.mailAPI.createSpecialReceiver).to.be.called
        .with(ctx, input);
      expect(data.specialReceiver.create, `${JSON.stringify(data)}`).to.deep.equal({
        id: data.specialReceiver.create.id,
        targetEmail: input.targetEmail,
      });
      idToRemove = data.specialReceiver.create.id;
    });

    it('removes special Receiver', async () => {
      chai.spy.on(dataSources.mailAPI, 'removeSpecialReceiver');
      const { data, errors } = await client.mutate({
        mutation: RemoveSpecialReceiverMutation,
        variables: {
          id: idToRemove,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.mailAPI.removeSpecialReceiver).to.be.called
        .with(ctx, idToRemove);
      expect(data.specialReceiver.remove, `${JSON.stringify(data)}`).to.deep.equal({
        id: idToRemove,
      });
    });
  });
});
