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
  MailAlias, Member, Position, Keycloak, Mandate,
} from '~/src/types/database';
import {
  aliases, keycloaks, keycloakUsers, mandates, members, positions,
} from './mailData';
import {
  GetMailAlias, GetMailAliases, ResolveRecipients, ResolveSenders,
} from './mailQueries';
import keycloakAdmin from '~/src/keycloak';

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
    await knex<Position>('positions').insert(positions);
    await knex<MailAlias>('email_aliases').insert(aliases);
  });

  afterEach(() => {
    chai.spy.restore(dataSources.mailAPI);
    sandbox.restore();
    sandbox.on(dataSources.mailAPI, 'withAccess', (name, context, fn) => fn());
  });

  after(async () => {
    sandbox.restore();
    chai.spy.restore(dataSources.mailAPI);
    await knex<Position>('positions').del();
  });

  describe(('GetMailAlias'), () => {
    it('get an email alias', async () => {
      chai.spy.on(dataSources.mailAPI, 'getAlias');
      const { data, errors } = await client.query({
        query: GetMailAlias,
        variables: {
          email: aliases[0].email,
        },
      });
      expect(dataSources.mailAPI.getAlias).to.be.called
        .with(ctx, aliases[0].email);
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.alias, `${JSON.stringify(data)}`).to.deep.equal({
        email: aliases[0].email,
        policies: [{
          id: aliases[0].id,
          position: {
            id: positions[0].id,
            name: positions[0].name,
          },
          canSend: true,
        }, {
          id: aliases[1].id,
          position: {
            id: positions[1].id,
            name: positions[1].name,
          },
          canSend: true,
        }],
      });
    });

    it('return null if alias does not exist', async () => {
      chai.spy.on(dataSources.mailAPI, 'getAlias');
      const { data, errors } = await client.query({
        query: GetMailAlias,
        variables: {
          email: 'doesnotexist@dsek.se',
        },
      });
      expect(dataSources.mailAPI.getAlias).to.be.called
        .with(ctx, 'doesnotexist@dsek.se');
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.alias, `${JSON.stringify(data)}`).to.be.null;
    });
  });

  describe(('GetMailAliases'), () => {
    it('get all email aliases', async () => {
      chai.spy.on(dataSources.mailAPI, 'getAliases');
      const { data, errors } = await client.query({
        query: GetMailAliases,
      });
      expect(dataSources.mailAPI.getAliases).to.be.called
        .with(ctx);
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.aliases, `${JSON.stringify(data)}`).to.deep.equal([{
        email: aliases[0].email,
        policies: [{
          id: aliases[0].id,
          position: {
            id: positions[0].id,
            name: positions[0].name,
          },
          canSend: true,
        }, {
          id: aliases[1].id,
          position: {
            id: positions[1].id,
            name: positions[1].name,
          },
          canSend: true,
        }],
      }, {
        email: aliases[2].email,
        policies: [{
          id: aliases[3].id,
          position: {
            id: positions[3].id,
            name: positions[3].name,
          },
          canSend: true,
        },
        {
          id: aliases[2].id,
          position: {
            id: positions[2].id,
            name: positions[2].name,
          },
          canSend: true,
        }],
      }]);
    });
  });
  describe(('ResolveRecipients'), () => {
    before(async () => {
      sandbox.on(keycloakAdmin, 'getUserEmail', (keycloakId: string) => {
        const user = keycloakUsers.find((ku) => ku.keycloakId === keycloakId);
        if (user) {
          return Promise.resolve(user.email);
        }
        return Promise.resolve(undefined);
      });
      await knex<Member>('members').insert(members);
      await knex<Keycloak>('keycloak').insert(keycloaks);
      await knex<Mandate>('mandates').insert(mandates);
    });

    after(async () => {
      await knex<Mandate>('mandates').del();
      await knex<Member>('members').del();
      await knex<Keycloak>('keycloak').del();
    });

    it('should resolve receipients', async () => {
      chai.spy.on(dataSources.mailAPI, 'resolveRecipients');

      const { data, errors } = await client.query({
        query: ResolveRecipients,
      });
      expect(dataSources.mailAPI.resolveRecipients).to.be.called();
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.resolveRecipients, `${JSON.stringify(data)}`).to.deep.equal([{
        alias: aliases[0].email,
        emailUsers: [{
          email: keycloakUsers[2].email,
          studentId: keycloakUsers[2].studentId,
        }, {
          email: keycloakUsers[3].email,
          studentId: keycloakUsers[3].studentId,
        }],
      }]);
    });
  });

  describe(('ResolveSenders'), () => {
    before(async () => {
      sandbox.on(keycloakAdmin, 'getUserEmail', (keycloakId: string) => {
        const user = keycloakUsers.find((ku) => ku.keycloakId === keycloakId);
        if (user) {
          return Promise.resolve(user.email);
        }
        return Promise.resolve(undefined);
      });
      await knex<Member>('members').insert(members);
      await knex<Keycloak>('keycloak').insert(keycloaks);
      await knex<Mandate>('mandates').insert(mandates);
    });

    after(async () => {
      await knex<Mandate>('mandates').del();
      await knex<Member>('members').del();
      await knex<Keycloak>('keycloak').del();
    });

    it('should resolve senders', async () => {
      chai.spy.on(dataSources.mailAPI, 'resolveSenders');

      const { data, errors } = await client.query({
        query: ResolveSenders,
      });
      expect(dataSources.mailAPI.resolveSenders).to.be.called();
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.resolveSenders, `${JSON.stringify(data)}`).to.deep.equal([{
        alias: aliases[0].email,
        emailUsers: [{
          email: keycloakUsers[2].email,
          studentId: keycloakUsers[2].studentId,
        }, {
          email: keycloakUsers[3].email,
          studentId: keycloakUsers[3].studentId,
        }],
      }]);
    });
  });
});
