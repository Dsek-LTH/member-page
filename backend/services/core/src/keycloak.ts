import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Knex } from 'knex';
import { createLogger } from './shared';

const logger = createLogger('keycloak-admin');

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

  async updateKeycloakMandates(
    knex: Knex,
  ): Promise<boolean> {
    let success = true;
    logger.info('Updating keycloak mandates');

    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString()
      .substring(0, 10);

    const expiredMandates = await knex('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '<', yesterday).where({ in_keycloak: true })
      .select('keycloak_id', 'position_id', 'mandates.id');
    logger.info(`Found ${expiredMandates.length} expired mandates.`);

    const mandatesToAdd = await knex<{ keycloak_id: string, position_id: string }>('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '>', today)
      .select('keycloak.keycloak_id', 'mandates.position_id', 'mandates.id');
    logger.info(`Found ${mandatesToAdd.length} mandates to add.`);

    logger.info('Updating keycloak...');
    await Promise.all(mandatesToAdd.map((mandate) => this
      .createMandate(mandate.keycloak_id, mandate.position_id)
      .then(async () => {
        await knex('mandates').where({ id: mandate.id }).update({ in_keycloak: true });
        logger.info(`Created mandate ${mandate.keycloak_id}->${mandate.position_id}`);
      })
      .catch((e) => {
        logger.error(`Failed to create mandate ${mandate.keycloak_id}->${mandate.position_id}`);
        logger.error(e);
        success = false;
      })));

    await Promise.all(expiredMandates.map((mandate) => this
      .deleteMandate(mandate.keycloak_id, mandate.position_id)
      .then(async () => {
        await knex('mandates').where({ id: mandate.id }).update({ in_keycloak: false });
        logger.info(`Deleted mandate ${mandate.keycloak_id}->${mandate.position_id}`);
      })
      .catch((e) => {
        logger.error(`Failed to delete mandate ${mandate.keycloak_id}->${mandate.position_id}`);
        logger.error(e);
        success = false;
      })));
    logger.info('Done updating mandates');
    return success;
  }

  // eslint-disable-next-line class-methods-use-this
  clearCache() {
    userEmails.clear();
  }
}
const keycloakAdmin = new KeycloakAdmin();

export default keycloakAdmin;
