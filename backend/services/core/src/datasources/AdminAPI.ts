import { ApolloError } from 'apollo-server';
import keycloakAdmin from '../keycloak';
import {
  dbUtils, context, createLogger, ApiAccessPolicy,
} from '../shared';
import meilisearchAdmin from '../shared/meilisearch';
import { AdminSetting } from '../types/database';
import { SETTING_KEYS } from '../shared/database';

const logger = createLogger('admin-api');

function getSeedDirectory(environment: string | undefined) {
  if (environment === 'production') return './dist/seeds';
  if (environment === 'development') return '../seeds';
  if (environment === 'test') return './seeds';
  throw new Error(`Unknown environment: ${environment}`);
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

  async getAdminSettings(ctx: context.UserContext): Promise<AdminSetting[]> {
    return this.withAccess('admin:settings:read', ctx, async () => {
      const res = await this.knex<AdminSetting>('admin_settings').select('*');
      return res;
    });
  }

  async getAdminSetting(ctx: context.UserContext, key: string): Promise<AdminSetting | undefined> {
    return this.withAccess('admin:settings:read', ctx, async () => {
      const res = await this.knex<AdminSetting>('admin_settings').select('*').where({ key }).first();
      return res;
    });
  }

  async createAdminSetting(ctx: context.UserContext, key: string, value: string):
  Promise<AdminSetting> {
    return this.withAccess('admin:settings:create', ctx, async () => {
      logger.info(`Creating admin setting ${key}:${value}`);
      const res = await this.knex<AdminSetting>('admin_settings').insert({ key, value }).returning('*');
      return res[0];
    });
  }

  async updateAdminSetting(ctx: context.UserContext, key: string, value: string):
  Promise<AdminSetting | undefined> {
    return this.withAccess('admin:settings:update', ctx, async () => {
      logger.info(`Updating admin setting ${key}:${value}`);
      const res = await this.knex<AdminSetting>('admin_settings').update({ value }).where({ key }).returning('*');
      return res[0];
    });
  }

  async deleteAdminSetting(ctx: context.UserContext, key: string):
  Promise<AdminSetting | undefined> {
    return this.withAccess('admin:settings:delete', ctx, async () => {
      logger.info(`Deleting admin setting ${key}`);
      const res = await this.knex<AdminSetting>('admin_settings').delete().where({ key }).returning('*');
      return res[0];
    });
  }

  // only to be used for set keys, since :create access is not checked
  private async setAdminSetting(ctx: context.UserContext, key: string, value: string):
  Promise<AdminSetting | undefined> {
    return this.withAccess('admin:settings:update', ctx, async () => {
      logger.info(`Settng admin setting ${key}:${value}`);
      const res = await this.knex<AdminSetting>('admin_settings').insert({ key, value }).onConflict('key').merge()
        .returning('*');
      return res[0];
    });
  }

  async setStabHiddenPeriod(ctx: context.UserContext, start: string, end: string):
  Promise<[AdminSetting | undefined, AdminSetting | undefined]> {
    const startPromise = this.setAdminSetting(ctx, SETTING_KEYS.stabHiddenStart, start);
    const endPromise = this.setAdminSetting(ctx, SETTING_KEYS.stabHiddenEnd, end);
    const [startRes, endRes] = await Promise.all([startPromise, endPromise]);
    this.updateStabHidden(); // force update
    return [startRes, endRes];
  }
}
