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
import { MailAlias, Position } from '~/src/types/database';
import { positions } from './mailData';
import { CreateMailAlias, RemoveMailAlias, UpdateSenderStatus } from './mailMutations';
import { GetMailAliases } from './mailQueries';

const ctx = { user: undefined, roles: undefined };

chai.use(spies);

const sandbox = chai.spy.sandbox();

let createdAliasId = '';

describe('Mail API Graphql Mutations', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(async () => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;
    client = createTestClient(server);
    sandbox.on(dataSources.mailAPI, 'withAccess', (name, context, fn) => fn());
    await knex<Position>('positions').insert(positions);
  });

  afterEach(() => {
    chai.spy.restore(dataSources.mailAPI);
  });

  after(async () => {
    await knex<Position>('positions').del();
    await knex<MailAlias>('email_aliases').del();
  });

  describe(('CreateMailAlias'), () => {
    it('create a mail alias', async () => {
      chai.spy.on(dataSources.mailAPI, 'createAlias');
      const { data, errors } = await client.mutate({
        mutation: CreateMailAlias,
        variables: {
          email: 'dwww@dsek.se',
          position_id: positions[0].id,
        },
      });
      expect(dataSources.mailAPI.createAlias).to.have.been.called
        .with(ctx, { email: 'dwww@dsek.se', position_id: positions[0].id });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.alias.create, `${JSON.stringify(data)}`).to.deep.equal({
        email: 'dwww@dsek.se',
        policies: [
          {
            id: data.alias.create.policies[0].id,
            position: {
              id: positions[0].id,
              name: positions[0].name,
            },
            canSend: false,
          },
        ],
      });
      createdAliasId = data.alias.create.policies[0].id;
    });

    it('updates existing alias sender status', async () => {
      const { data: original } = await client.query({
        query: GetMailAliases,
      });
      expect(original.aliases[0].policies[0].canSend).to.be.false;

      chai.spy.on(dataSources.mailAPI, 'updateSenderStatus');
      const input = [
        {
          id: createdAliasId,
          canSend: true,
        },
      ];
      const { data, errors } = await client.mutate({
        mutation: UpdateSenderStatus,
        variables: {
          input,
        },
      });
      expect(dataSources.mailAPI.updateSenderStatus).to.have.been.called
        .with(ctx, input);
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.alias.updateSenderStatus, `${JSON.stringify(data)}`).to.be.true;

      const { data: updated } = await client.query({
        query: GetMailAliases,
      });
      expect(updated.aliases[0].policies[0].canSend).to.be.true;
    });

    it('fail if alias already exists', async () => {
      chai.spy.on(dataSources.mailAPI, 'createAlias');
      const { data, errors } = await client.mutate({
        mutation: CreateMailAlias,
        variables: {
          email: 'dwww@dsek.se',
          position_id: positions[0].id,
        },
      });
      expect(dataSources.mailAPI.createAlias).to.have.been.called
        .with(ctx, { email: 'dwww@dsek.se', position_id: positions[0].id });
      if (errors?.length) {
        expect(errors[0].message, `${JSON.stringify(errors)}`).to.equal('This alias already exists.');
      } else {
        expect.fail('Expected error');
      }
      expect(data.alias.create, `${JSON.stringify(data)}`).to.be.null;
    });

    it('fail if position does not exist', async () => {
      chai.spy.on(dataSources.mailAPI, 'createAlias');
      const { data, errors } = await client.mutate({
        mutation: CreateMailAlias,
        variables: {
          email: 'dwww@dsek.se',
          position_id: 'nonexisting',
        },
      });
      expect(dataSources.mailAPI.createAlias).to.have.been.called
        .with(ctx, { email: 'dwww@dsek.se', position_id: 'nonexisting' });
      if (errors?.length) {
        expect(errors[0].message, `${JSON.stringify(errors)}`).to.equal('Position does not exist');
      } else {
        expect.fail('Expected error');
      }
      expect(data.alias.create, `${JSON.stringify(data)}`).to.be.null;
    });
  });

  describe(('RemoveMailAlias'), () => {
    it('remove a mail alias', async () => {
      chai.spy.on(dataSources.mailAPI, 'removeAlias');
      const { id } = (await knex<MailAlias>('email_aliases')
        .insert({ email: 'remove@dsek.se', position_id: positions[0].id })
        .returning('id'))[0];
      const { data, errors } = await client.mutate({
        mutation: RemoveMailAlias,
        variables: {
          id,
        },
      });
      expect(dataSources.mailAPI.removeAlias).to.have.been.called
        .with(ctx, id);
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.alias.remove, `${JSON.stringify(data)}`).to.deep.equal({
        email: 'remove@dsek.se',
        policies: [],
      });
    });

    it('fail if alias does not exist', async () => {
      chai.spy.on(dataSources.mailAPI, 'removeAlias');
      const { data, errors } = await client.mutate({
        mutation: RemoveMailAlias,
        variables: {
          id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        },
      });
      if (errors?.length) {
        expect(errors[0].message, `${JSON.stringify(errors)}`).to.equal('This alias does not exists.');
      } else {
        expect.fail('Expected error');
      }
      expect(data.alias.remove, `${JSON.stringify(data)}`).to.be.null;
      expect(dataSources.mailAPI.removeAlias).to.have.been.called();
    });
  });
});
