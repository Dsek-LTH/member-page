import KcAdminClient from '@keycloak/keycloak-admin-client';
import { createLogger } from './shared';

const logger = createLogger('core-service:keycloak');

const userEmails = new Map<string, string>();

const {
  KEYCLOAK_ADMIN_USERNAME,
  KEYCLOAK_ADMIN_PASSWORD,
  KEYCLOAK_ENDPOINT,
} = process.env;

/**
 * turns dsek.sexm.kok.mastare into ['dsek', 'dsek.sexm', 'dsek.sexm.kok', 'dsek.sexm.kok.mastare']
 * @param id the key of the position
 * @returns return a list of roles part of the position
 */
export function getRoleNames(id: string): string[] {
  const parts = id.split('.');
  return [...Array(parts.length).keys()].map((i) => parts.slice(0, i + 1).join('.'));
}

class KeycloakAdmin {
  public client: KcAdminClient;

  constructor() {
    this.client = new KcAdminClient({
      baseUrl: `${KEYCLOAK_ENDPOINT}auth`,
      realmName: 'master',
    });
  }

  async auth() {
    this.client.setConfig({ realmName: 'master' });
    await this.client.auth({
      username: KEYCLOAK_ADMIN_USERNAME || '',
      password: KEYCLOAK_ADMIN_PASSWORD || '',
      grantType: 'password',
      clientId: 'admin-cli',
    });
    this.client.setConfig({ realmName: 'dsek' });
  }

  async getGroupId(positionId: string): Promise<string | undefined> {
    const roleNames = getRoleNames(positionId);
    const foundGroups = await this.client.groups.find();
    let group = foundGroups.find((g) => g.name === roleNames[0]);
    roleNames.slice(1).forEach((name) => {
      group = group?.subGroups?.find((g) => g.name === name);
    });
    if (!group) {
      logger.error(`Failed to find group for position ${positionId}`);
    }
    return group?.id;
  }

  /**
   * Checks if a group exists given a position id.
   * @param id the key of the position
   * @param boardMember whether the position is a board member
   */
  async checkIfGroupExists(positionId: string): Promise<boolean> {
    if (process.env.KEYCLOAK_ENABLED !== 'true') return false;
    return !!await this.getGroupId(positionId);
  }

  /**
   * Creates a group mapping for the user.
   * @param userId the keycloak id of the user
   * @param positionId the key of the position
   */
  async createMandate(userId: string, positionId: string) {
    if (process.env.KEYCLOAK_ENABLED !== 'true') return;
    await this.auth();
    const groupId = await this.getGroupId(positionId);
    if (groupId) { await this.client.users.addToGroup({ id: userId, groupId }); }
  }

  /**
   * Deletes a group mapping for the user.
   * @param userId the keycloak id of the user
   * @param positionId the key of the position
   */
  async deleteMandate(userId: string, positionId: string) {
    if (process.env.KEYCLOAK_ENABLED !== 'true') return;
    await this.auth();
    const groupId = await this.getGroupId(positionId);

    if (groupId) {
      await this.client.users.delFromGroup({ id: userId, groupId });
    }
  }

  async getUserData(keycloakIds: string[]):
  Promise<{ keycloakId: string, email: string, studentId: string }[]> {
    if (process.env.KEYCLOAK_ENABLED !== 'true') return [];
    await this.auth();

    const result = [];

    for (let i = 0; i < keycloakIds.length; i += 1) {
      const id = keycloakIds[i];
      // eslint-disable-next-line no-await-in-loop
      const user = await this.client.users.findOne({ id });
      if (user?.email && user?.username) {
        result.push({
          keycloakId: id,
          email: user.email,
          studentId: user.username,
        });
      }
    }
    return result;
  }

  async getUserEmail(keycloakId: string): Promise<string | undefined> {
    if (process.env.KEYCLOAK_ENABLED !== 'true') return undefined;
    if (!userEmails.has(keycloakId)) {
      await this.auth();
      const user = await this.client.users.findOne({ id: keycloakId });
      if (user?.email) {
        userEmails.set(keycloakId, user.email);
      }
      return user?.email;
    }
    return userEmails.get(keycloakId);
  }

  // eslint-disable-next-line class-methods-use-this
  clearCache() {
    userEmails.clear();
  }
}
const keycloakAdmin = new KeycloakAdmin();

export default keycloakAdmin;
