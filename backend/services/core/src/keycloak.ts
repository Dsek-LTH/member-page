import KcAdminClient from '@keycloak/keycloak-admin-client';

class KeycloakAdmin {
  private client: KcAdminClient;

  constructor() {
    this.client = new KcAdminClient({
      baseUrl: 'https://portal.dsek.se/auth/realms/master/',
      realmName: 'dsek',
    });
  }

  async auth() {
    await this.client.auth({
      username: process.env.KEYCLOAK_ADMIN_USERNAME || '',
      password: process.env.KEYCLOAK_ADMIN_PASSWORD || '',
      grantType: 'password',
      clientId: 'admin-cli',
    });
  }

  /**
   * turns 'dsek.sexm.kok.mastare' into ['dsek', 'dsek.sexm', 'dsek.sexm.kok', 'dsek.sexm.kok.mastare']
   * @param id the key of the position
   * @returns return a list of roles part of the position
   */
  private getRoles(id: string): string[] {
    const parts = id.split('.');
    return [...Array(parts.length).keys()].map(i => parts.slice(0, i+1).join('.'));
  }

  private async getGroupId(name: string): Promise<string | undefined> {
    const groups = await this.client.groups.find();
    return groups.find(g => g.name === name)?.id;
  }

  /**
   * Creates the group and roles neccecary for the position. Adds role 'dsek.styr' to the group if position is a board member.
   * @param id the key of the position
   * @param boardMember whether the position is a board member
   */
  async createPosition(id: string, boardMember: boolean) {
    await this.auth();
    const roles = this.getRoles(id);

    if (boardMember)
      roles.push('dsek.styr');

    // create roles
    await Promise.all(roles.map((role) => this.client.roles.create({ name: role })));

    // create group
    await this.client.groups.create({ name: id, realmRoles: roles, });
  }

  /**
   * Deletes the group associated with the position.
   * @param id the key of the position
   */
  async deletePosition(id: string) {
    await this.auth();
    const groupId = await this.getGroupId(id);
    if (groupId) {
      await this.client.groups.del({ id: groupId });
    }
  }

  /**
   * Creates a group mapping for the user.
   * @param userId the keycloak id of the user
   * @param positionId the key of the position
   */
  async createMandate(userId: string, positionId: string) {
    await this.auth();
    const groupId = await this.getGroupId(positionId);

    if (groupId)
      await this.client.users.addToGroup({ id: userId, groupId });
  }

  /**
   * Deletes a group mapping for the user.
   * @param userId the keycloak id of the user
   * @param positionId the key of the position
   */
  async deleteMandate(userId: string, positionId: string) {
    await this.auth();
    const groupId = await this.getGroupId(positionId);

    if (groupId)
      await this.client.users.delFromGroup({ id: userId, groupId });
  }
}

const keycloakAdmin = new KeycloakAdmin();

export default keycloakAdmin;