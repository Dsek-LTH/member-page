import { ApolloError } from 'apollo-server';
import keycloakAdmin from '../keycloak';
import {
  dbUtils, context, createLogger, ApiAccessPolicy,
} from '../shared';
import meilisearchAdmin from '../shared/meilisearch';

const logger = createLogger('admin-api');

function getSeedDirectory(environment: string | undefined) {
  if (environment === 'production') return './dist/seeds';
  if (environment === 'development') return '../seeds';
  return './seeds';
}

export default class AdminAPI extends dbUtils.KnexDataSource {
  updateSearchIndex(
    ctx: context.UserContext,
  ): Promise<boolean> {
    return this.withAccess('core:admin', ctx, async () => {
      const success = await meilisearchAdmin.indexMeilisearch(this.knex);
      if (!success) {
        throw new Error('Failed to update search index');
      }
      return true;
    });
  }

  private async seedDatabase() {
    try {
      const [seeds] = await this.knex.seed.run({
        directory:
         getSeedDirectory(process.env.NODE_ENV),
      });
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
    if (apiAccessPolicies.length === 0) {
      logger.info('Database is empty, seeding...');
      return this.seedDatabase();
    }
    if (process.env.SANDBOX === 'true') {
      return this.withAccess('core:admin', ctx, async () => {
        logger.info('Database is already seeded, but seeding anyway because we are in sandbox mode and you are an admin.');
        return this.seedDatabase();
      });
    }
    throw new ApolloError('Database is already seeded');
  }

  syncMandatesWithKeycloak(ctx: context.UserContext): Promise<boolean> {
    return this.withAccess('core:admin', ctx, async () => {
      try {
        await keycloakAdmin.updateKeycloakMandates(this.knex);
        return true;
      } catch (e: any) {
        logger.error(e);
        throw new Error(e);
      }
    });
  }
}
