import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import KeycloakAdmin, { getRoleNames } from '~/src/keycloak';
import {
  Mandate, Keycloak, Member, Position,
} from '~/src/types/database';
import { knex } from '~/src/shared';
import {
  expiredMandates, keycloakGroups, keycloaks, keycloakUsers, mandatesToAdd, members, positions,
} from './data';

chai.use(spies);
const sandbox = chai.spy.sandbox();

describe('Keycloak', () => {
  before(() => {
    process.env.KEYCLOAK_ENABLED = 'true';
    delete process.env.KEYCLOAK_ADMIN_USERNAME;
  });
  after(async () => {
    delete process.env.KEYCLOAK_ENABLED;
  });
  beforeEach(() => {
    process.env.KEYCLOAK_ENABLED = 'true';
    sandbox.on(KeycloakAdmin.client, 'setConfig', () => {});
    sandbox.on(KeycloakAdmin.client, 'auth', () => Promise.resolve());
    sandbox.on(KeycloakAdmin.client.users, 'findOne', ({ id }) => {
      if (id === keycloakUsers[0].keycloakId) {
        return Promise.resolve({
          id: keycloakUsers[0].keycloakId,
          email: keycloakUsers[0].email,
          username: keycloakUsers[0].studentId,
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
    chai.spy.restore(KeycloakAdmin);
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
      const email = await KeycloakAdmin.getUserEmail(keycloakUsers[0].keycloakId);
      expect(email).to.equal(keycloakUsers[0].email);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called
        .with({ id: keycloakUsers[0].keycloakId });
    });

    it('should use cache to fetch email if available', async () => {
      await KeycloakAdmin.getUserEmail(keycloakUsers[0].keycloakId);
      await KeycloakAdmin.getUserEmail(keycloakUsers[0].keycloakId);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called.once;
    });

    it('should return undefined if user is not found', async () => {
      const email = await KeycloakAdmin.getUserEmail('not-found');
      expect(email).to.equal(undefined);
    });

    it('should return undefined if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      const email = await KeycloakAdmin.getUserEmail(keycloakUsers[0].keycloakId);
      expect(email).to.equal(undefined);
    });
  });

  describe('getUserData', () => {
    it('should return the correct data for a user', async () => {
      const userDatas = await KeycloakAdmin.getUserData([keycloakUsers[0].keycloakId]);
      expect(userDatas).to.deep.equal([keycloakUsers[0]]);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called
        .with({ id: keycloakUsers[0].keycloakId });
    });

    it('should return an empty array for no users found', async () => {
      const userDatas = await KeycloakAdmin.getUserData(['notfound']);
      expect(userDatas).to.deep.equal([]);
      expect(KeycloakAdmin.client.users.findOne).to.have.been.called
        .with({ id: 'notfound' });
    });

    it('should return an empty array if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      const userDatas = await KeycloakAdmin.getUserData([keycloakUsers[0].keycloakId]);
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
      await KeycloakAdmin.createMandate(keycloakUsers[0].keycloakId, 'dsek.infu.dwww.mastare');
      expect(KeycloakAdmin.client.users.addToGroup).to.have.been.called
        .with({ id: keycloakUsers[0].keycloakId, groupId: 'f1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d' });
    });

    it('should not call addToGroup if group does not exist', async () => {
      await KeycloakAdmin.createMandate(keycloakUsers[0].keycloakId, 'dsek.bajsmacka');
      expect(KeycloakAdmin.client.users.addToGroup).to.not.have.been.called;
    });

    it('should not call addToGroup if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      await KeycloakAdmin.createMandate(keycloakUsers[0].keycloakId, 'dsek.infu.dwww.mastare');
      expect(KeycloakAdmin.client.users.addToGroup).to.not.have.been.called;
    });
  });

  describe('deleteMandate', () => {
    it('should delete a mandate', async () => {
      await KeycloakAdmin.deleteMandate(keycloakUsers[0].keycloakId, 'dsek.infu.dwww.mastare');
      expect(KeycloakAdmin.client.users.delFromGroup).to.have.been.called
        .with({ id: keycloakUsers[0].keycloakId, groupId: 'f1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d' });
    });

    it('should not delete a mandate if the group does not exist', async () => {
      await KeycloakAdmin.deleteMandate(keycloakUsers[0].keycloakId, 'dsek.bajsmacka');
      expect(KeycloakAdmin.client.users.delFromGroup).to.not.have.been.called;
    });

    it('should not delete a mandate if keycloak is disabled', async () => {
      delete process.env.KEYCLOAK_ENABLED;
      await KeycloakAdmin.deleteMandate(keycloakUsers[0].keycloakId, 'dsek.infu.dwww.mastare');
      expect(KeycloakAdmin.client.users.delFromGroup).to.not.have.been.called;
    });
  });

  describe('updateKeycloakMandates', () => {
    beforeEach(async () => {
      await knex<Member>('members').insert(members);
      await knex<Position>('positions').insert(positions);
      await knex<Keycloak>('keycloak').insert(keycloaks);
    });
    afterEach(async () => {
      await knex('keycloak').del();
      await knex('mandates').del();
      await knex('positions').del();
      await knex('members').del();
    });
    after(async () => {
      await knex('mandates').del();
    });

    it('should remove expired mandates from keycloak', async () => {
      await knex<Mandate>('mandates').insert(expiredMandates);
      const success = await KeycloakAdmin.updateKeycloakMandates(knex);
      expect(KeycloakAdmin.client.users.delFromGroup).to.have.been.called.twice;
      expect(KeycloakAdmin.client.users.addToGroup).to.not.have.been.called;
      expect(success).to.be.true;
      const mandates = await knex<Mandate>('mandates').where({ in_keycloak: false });
      expect(mandates).to.have.lengthOf(2);
    });

    it('should add mandates to keycloak, and not remove already removed ones', async () => {
      await knex<Mandate>('mandates').insert(mandatesToAdd);
      const success = await KeycloakAdmin.updateKeycloakMandates(knex);
      expect(KeycloakAdmin.client.users.addToGroup).to.have.been.called.twice;
      expect(KeycloakAdmin.client.users.delFromGroup).to.not.have.been.called;
      expect(success).to.be.true;
      const mandates = await knex<Mandate>('mandates').where({ in_keycloak: true });
      expect(mandates).to.have.lengthOf(2);
    });

    it('should be able to add and remove mandates', async () => {
      await knex<Mandate>('mandates').insert(mandatesToAdd);
      await knex<Mandate>('mandates').insert(expiredMandates);
      const success = await KeycloakAdmin.updateKeycloakMandates(knex);
      expect(KeycloakAdmin.client.users.addToGroup).to.have.been.called.twice;
      expect(KeycloakAdmin.client.users.delFromGroup).to.have.been.called.twice;
      expect(success).to.be.true;
    });

    it('simulate failure', async () => {
      await knex<Mandate>('mandates').insert(mandatesToAdd);
      await knex<Mandate>('mandates').insert(expiredMandates);
      sandbox.on(KeycloakAdmin, 'createMandate', () => Promise.reject(new Error('creation failed because epic')));
      sandbox.on(KeycloakAdmin, 'deleteMandate', () => Promise.reject(new Error('delete failed because epic')));
      const success = await KeycloakAdmin.updateKeycloakMandates(knex);
      expect(success).to.be.false;
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
