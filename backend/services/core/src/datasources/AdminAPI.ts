import keycloakAdmin from '../keycloak';
import {
  dbUtils, context, meilisearch, createLogger,
} from '../shared';

const logger = createLogger('admin-api');

export default class AdminAPI extends dbUtils.KnexDataSource {
  updateSearchIndex(
    ctx: context.UserContext,
  ): Promise<boolean> {
    return this.withAccess('core:admin', ctx, async () => {
      await meilisearch.deleteIndexIfExists('members');
      const members = await this.knex
        .select('id', 'student_id', 'first_name', 'nickname', 'last_name', 'picture_path').from('members');
      const index = meilisearch.index('members');
      await index.addDocuments(members);
      return true;
    });
  }

  seed(ctx: context.UserContext): Promise<boolean> {
    return this.withAccess('core:admin', ctx, async () => {
      if (process.env.SANDBOX !== 'true') {
        throw new Error('Can only seed in sandbox mode');
      }
      try {
        const [seeds] = await this.knex.seed.run({ directory: '../seeds' });
        logger.info('Seed successful');
        logger.info('Seeds applied:');
        seeds.forEach((s) => logger.info(`\t${s}`));
        return true;
      } catch (e: any) {
        logger.error('SEEDS FAILED');
        logger.error(e);
        throw new Error(e);
      }
    });
  }

  syncMandatesWithKeycloak(ctx: context.UserContext): Promise<boolean> {
    return this.withAccess('core:admin', ctx, async () => {
      logger.info('Updating keycloak mandates');

      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString()
        .substring(0, 10);

      const expiredMandates = await this.knex('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '<', yesterday).where({ in_keycloak: true })
        .select('keycloak_id', 'position_id', 'mandates.id');
      logger.info(`Found ${expiredMandates.length} expired mandates.`);

      const mandatesToAdd = await this.knex<{ keycloak_id: string, position_id: string }>('mandates').join('keycloak', 'mandates.member_id', '=', 'keycloak.member_id').where('end_date', '>', yesterday).where({ in_keycloak: false })
        .select('keycloak.keycloak_id', 'mandates.position_id', 'mandates.id');
      logger.info(`Found ${mandatesToAdd.length} mandates to add.`);

      logger.info('Updating keycloak...');
      await Promise.all(mandatesToAdd.map((mandate) => keycloakAdmin
        .createMandate(mandate.keycloak_id, mandate.position_id)
        .then(async () => {
          await this.knex('mandates').where({ id: mandate.id }).update({ in_keycloak: true });
          logger.info(`Created mandate ${mandate.keycloak_id}->${mandate.position_id}`);
        })
        .catch(() => logger.info(`Failed to create mandate ${mandate.keycloak_id}->${mandate.position_id}`))));

      await Promise.all(expiredMandates.map((mandate) => keycloakAdmin
        .deleteMandate(mandate.keycloak_id, mandate.position_id)
        .then(async () => {
          await this.knex('mandates').where({ id: mandate.id }).update({ in_keycloak: false });
          logger.info(`Deleted mandate ${mandate.keycloak_id}->${mandate.position_id}`);
        })
        .catch(() => logger.info(`Failed to delete mandate ${mandate.keycloak_id}->${mandate.position_id}`))));
      logger.info('Done updating mandates');
      return true;
    });
  }
}
