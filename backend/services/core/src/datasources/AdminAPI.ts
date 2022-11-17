import {
  dbUtils, context, createLogger, ApiAccessPolicy,
} from '../shared';
import { indexMeilisearch, updateKeycloakMandates } from '../shared/adminUtils';

const logger = createLogger('admin-api');

export default class AdminAPI extends dbUtils.KnexDataSource {
  updateSearchIndex(
    ctx: context.UserContext,
  ): Promise<boolean> {
    return this.withAccess('core:admin', ctx, async () => indexMeilisearch(this.knex, logger));
  }

  private async seedDatabase() {
    try {
      const [seeds] = await this.knex.seed.run({ directory: process.env.NODE_ENV === 'production' ? './dist/seeds' : '../seeds' });
      logger.info('Seed successful');
      logger.info('Seeds applied:');
      seeds.forEach((s) => logger.info(`\t${s}`));
      return true;
    } catch (e: any) {
      logger.error('SEEDS FAILED');
      logger.error(e);
      throw new Error(e);
    }
  }

  async seed(ctx: context.UserContext): Promise<boolean> {
    const apiAccessPolicies = await this.knex<ApiAccessPolicy>('api_access_policies');
    if (process.env.SANDBOX === 'true') {
      if (apiAccessPolicies.length === 0) {
        return this.seedDatabase();
      }
      return this.withAccess('core:admin', ctx, async () => this.seedDatabase());
    }
    if (apiAccessPolicies.length === 0) {
      return this.seedDatabase();
    }
    throw new Error('Database is already seeded');
  }

  syncMandatesWithKeycloak(ctx: context.UserContext): Promise<boolean> {
    return this.withAccess('core:admin', ctx, async () => {
      try {
        await updateKeycloakMandates(this.knex, logger);
        return true;
      } catch (e: any) {
        logger.error(e);
        throw new Error(e);
      }
    });
  }
}
