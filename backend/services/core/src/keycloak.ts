import KcAdminClient from '@keycloak/keycloak-admin-client';
import { createLogger } from './shared';

const logger = createLogger('core-service:keycloak');

const userEmails = new Map<string, string>();

const {
  KEYCLOAK_ADMIN_USERNAME,
  KEYCLOAK_ADMIN_PASSWORD,
  KEYCLOAK_ENDPOINT,
  KEYCLOAK_ENABLED,
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

  private async getGroupId(id: string): Promise<string | undefined> {
    const roleNames = getRoleNames(id);
    let group = (await this.client.groups.find()).find((g) => g.name === roleNames[0]);
    roleNames.slice(1).forEach((name) => {
      group = group?.subGroups?.find((g) => g.name === name);
    });
    return group?.id;
  }

  private async createRole(role: string) {
    try {
      await this.client.roles.create({ name: role });
      logger.info(`Created role ${role}`);
    } catch (e: any) {
      if (e.message.includes('409')) { logger.info(`Role ${role} already exists`); } else { logger.error(`Failed to create role ${role}`, e); }
    }
    return this.client.roles.findOneByName({ name: role });
  }

  /**
   * Checks if the group exists and adds the role mappings. Adds role 'dsek.styr'
   * to the group if position is a board member. Due to restitions in the connection
   * between keycloak and IPA, the group needs to be created in IPA first.
   * @param id the key of the position
   * @param boardMember whether the position is a board member
   */
  async createPosition(id: string, boardMember: boolean): Promise<boolean> {
    if (!KEYCLOAK_ENABLED) return true;
    await this.auth();
    const roleNames = getRoleNames(id);

    if (boardMember) { roleNames.push('dsek.styr'); }

    // get group
    const groupId = await this.getGroupId(id);

    if (!groupId) { return false; }

    // create roles
    const keycloakRoles = await Promise.all(roleNames.map((name) => this.createRole(name)));

    // Map roles to group
    const rolesPayload = keycloakRoles.map((r) => ({
      id: r?.id as string, name: r?.name as string,
    }));
    await this.client.groups.addRealmRoleMappings({ id: groupId, roles: rolesPayload });

    return true;
  }

  /**
   * Creates a group mapping for the user.
   * @param userId the keycloak id of the user
   * @param positionId the key of the position
   */
  async createMandate(userId: string, positionId: string) {
    if (!KEYCLOAK_ENABLED) return;
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
    if (!KEYCLOAK_ENABLED) return;
    await this.auth();
    const groupId = await this.getGroupId(positionId);

    if (groupId) {
      await this.client.users.delFromGroup({ id: userId, groupId });
    }
  }

  async getUserData(keycloakIds: string[]):
  Promise<{ keycloakId: string, email: string, studentId: string }[]> {
    if (!process.env.KEYCLOAK_ENABLED) return [];
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
    if (!process.env.KEYCLOAK_ENABLED) return undefined;
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
