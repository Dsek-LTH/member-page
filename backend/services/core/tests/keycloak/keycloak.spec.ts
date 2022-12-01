import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import KeycloakAdmin, { getRoleNames } from '~/src/keycloak';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const userData = { keycloakId: 'abf1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d', email: 'oliver@dsek.se', studentId: 'oliver' };

describe('Keycloak', () => {
  before(() => {
    process.env.KEYCLOAK_ENABLED = 'true';
    delete process.env.KEYCLOAK_ADMIN_USERNAME;
  });
  after(() => {
    delete process.env.KEYCLOAK_ENABLED;
  });
  beforeEach(() => {
    sandbox.on(KeycloakAdmin.client, 'setConfig', () => {});
    sandbox.on(KeycloakAdmin.client, 'auth', () => Promise.resolve());
    sandbox.on(KeycloakAdmin.client.users, 'findOne', (keycloakId) =>
      Promise.resolve({ keycloakId, email: 'oliver@dsek.se', username: 'oliver' }));
  });
  afterEach(() => {
    sandbox.restore();
    KeycloakAdmin.clearCache();
  });
  describe('getRoleNames', () => {
    it('should return the correct role names for a position', () => {
      const positionId = 'dsek.sexm.kok.mastare';
      const result = getRoleNames(positionId);
      expect(result).to.deep.equal(['dsek', 'dsek.sexm', 'dsek.sexm.kok', 'dsek.sexm.kok.mastare']);
    });
  });

  describe('getUserEmail', () => {
    it('should return the correct email for a user', async () => {
      const email = await KeycloakAdmin.getUserEmail(userData.keycloakId);
      expect(email).to.equal(userData.email);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called
        .with({ id: userData.keycloakId });
    });

    it('should use cache to fetch email if available', async () => {
      await KeycloakAdmin.getUserEmail(userData.keycloakId);
      await KeycloakAdmin.getUserEmail(userData.keycloakId);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called.once;
    });
  });

  describe('getUserData', () => {
    it('should return the correct data for a user', async () => {
      const userDatas = await KeycloakAdmin.getUserData([userData.keycloakId]);
      expect(userDatas).to.deep.equal([userData]);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called
        .with({ id: userData.keycloakId });
    });
  });
});
