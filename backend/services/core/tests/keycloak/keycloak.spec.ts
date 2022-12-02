import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import KeycloakAdmin, { getRoleNames } from '~/src/keycloak';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const userData = { keycloakId: 'abf1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d', email: 'oliver@dsek.se', studentId: 'oliver' };

const keycloakGroups = [
  {
    id: 'abf1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
    name: 'dsek',
    path: '/dsek',
    subGroups: [
      {
        id: 'ad1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
        path: '/dsek/dsek.infu',
        name: 'dsek.infu',
        subGroups: [
          {
            id: 'qb1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
            path: '/dsek/dsek.infu/dsek.infu.dwww',
            name: 'dsek.infu.dwww',
            subGroups: [
              {
                id: 'f1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
                name: 'dsek.infu.dwww.mastare',
                path: '/dsek/dsek.infu/dsek.infu.dwww/dsek.infu.dwww.mastare',
              },
            ],
          },
        ],
      },
    ],
  },
];

describe('Keycloak', () => {
  before(() => {
    process.env.KEYCLOAK_ENABLED = 'true';
    delete process.env.KEYCLOAK_ADMIN_USERNAME;
  });
  after(() => {
    delete process.env.KEYCLOAK_ENABLED;
  });
  beforeEach(() => {
    process.env.KEYCLOAK_ENABLED = 'true';
    sandbox.on(KeycloakAdmin.client, 'setConfig', () => {});
    sandbox.on(KeycloakAdmin.client, 'auth', () => Promise.resolve());
    sandbox.on(KeycloakAdmin.client.users, 'findOne', ({ id }) => {
      if (id === userData.keycloakId) {
        return Promise.resolve({
          id: userData.keycloakId,
          email: userData.email,
          username: userData.studentId,
        });
      }
      return Promise.resolve(undefined);
    });
    sandbox.on(KeycloakAdmin.client.users, 'addToGroup', () => Promise.resolve());
    sandbox.on(KeycloakAdmin.client.users, 'delFromGroup', () => Promise.resolve());
    sandbox.on(KeycloakAdmin.client.groups, 'find', () => Promise.resolve(keycloakGroups));
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

    it('should return undefined if user is not found', async () => {
      const email = await KeycloakAdmin.getUserEmail('not-found');
      expect(email).to.equal(undefined);
    });

    it('should return undefined if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      const email = await KeycloakAdmin.getUserEmail(userData.keycloakId);
      expect(email).to.equal(undefined);
    });
  });

  describe('getUserData', () => {
    it('should return the correct data for a user', async () => {
      const userDatas = await KeycloakAdmin.getUserData([userData.keycloakId]);
      expect(userDatas).to.deep.equal([userData]);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called
        .with({ id: userData.keycloakId });
    });

    it('should return an empty array for no users found', async () => {
      const userDatas = await KeycloakAdmin.getUserData(['notfound']);
      expect(userDatas).to.deep.equal([]);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called
        .with({ id: 'notfound' });
    });

    it('should return an empty array if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      const userDatas = await KeycloakAdmin.getUserData([userData.keycloakId]);
      expect(userDatas).to.deep.equal([]);
      expect(KeycloakAdmin.client.users.findOne).to.have.not.been.called;
    });
  });

  describe('getGroupId', () => {
    it('should return the correct group id for a position', async () => {
      const groupId = await KeycloakAdmin.getGroupId('dsek.infu.dwww.mastare');
      expect(groupId).to.equal('f1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d');
    });
    it('should return the group id for another position', async () => {
      const groupId = await KeycloakAdmin.getGroupId('dsek.infu.dwww');
      expect(groupId).to.equal('qb1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d');
    });
    it('should return undefined if the group does not exist', async () => {
      const groupId = await KeycloakAdmin.getGroupId('dsek.infu.dwww.king');
      expect(groupId).to.equal(undefined);
    });
  });

  describe('createMandate', () => {
    it('should call addToGroup if group exists', async () => {
      await KeycloakAdmin.createMandate(userData.keycloakId, 'dsek.infu.dwww.mastare');
      expect(KeycloakAdmin.client.users.addToGroup).to.have.been.called
        .with({ id: userData.keycloakId, groupId: 'f1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d' });
    });

    it('should not call addToGroup if group does not exist', async () => {
      await KeycloakAdmin.createMandate(userData.keycloakId, 'dsek.bajsmacka');
      expect(KeycloakAdmin.client.users.addToGroup).to.not.have.been.called;
    });

    it('should not call addToGroup if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      await KeycloakAdmin.createMandate(userData.keycloakId, 'dsek.infu.dwww.mastare');
      expect(KeycloakAdmin.client.users.addToGroup).to.not.have.been.called;
    });
  });

  describe('deleteMandate', () => {
    it('should delete a mandate', async () => {
      await KeycloakAdmin.deleteMandate(userData.keycloakId, 'dsek.infu.dwww.mastare');
      expect(KeycloakAdmin.client.users.delFromGroup).to.have.been.called
        .with({ id: userData.keycloakId, groupId: 'f1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d' });
    });

    it('should not delete a mandate if the group does not exist', async () => {
      await KeycloakAdmin.deleteMandate(userData.keycloakId, 'dsek.bajsmacka');
      expect(KeycloakAdmin.client.users.delFromGroup).to.not.have.been.called;
    });

    it('should not delete a mandate if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      await KeycloakAdmin.deleteMandate(userData.keycloakId, 'dsek.infu.dwww.mastare');
      expect(KeycloakAdmin.client.users.delFromGroup).to.not.have.been.called;
    });
  });

  describe('checkIfGroupExists', () => {
    it('should return true for existing group', async () => {
      let result = await KeycloakAdmin.checkIfGroupExists('dsek.infu.dwww.mastare');
      expect(result).to.equal(true);
      result = await KeycloakAdmin.checkIfGroupExists('dsek.infu.dwww');
      expect(result).to.equal(true);
      result = await KeycloakAdmin.checkIfGroupExists('dsek.infu');
      expect(result).to.equal(true);
      result = await KeycloakAdmin.checkIfGroupExists('dsek');
      expect(result).to.equal(true);
    });

    it('should return false for non-existing group', async () => {
      let result = await KeycloakAdmin.checkIfGroupExists('dsek.infu.dwww.king');
      expect(result).to.equal(false);
      result = await KeycloakAdmin.checkIfGroupExists('ekonom');
      expect(result).to.equal(false);
      result = await KeycloakAdmin.checkIfGroupExists('dsek.harpa');
      expect(result).to.equal(false);
    });

    it('should return false if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      const result = await KeycloakAdmin.checkIfGroupExists('dsek.infu.dwww.mastare');
      expect(result).to.equal(false);
    });
  });
});
