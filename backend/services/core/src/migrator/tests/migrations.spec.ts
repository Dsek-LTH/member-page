/* eslint-disable no-console */
import 'mocha';
import { expect } from 'chai';
import { knex } from '../../shared';

async function migrateToLatest() {
  try {
    await knex.migrate.latest();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function rollback() {
  try {
    await knex.migrate.rollback();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

describe('Migrations', () => {
  it('should be able to migrate to latest', async () => {
    expect(await migrateToLatest()).to.equal(true);
  });
  it('should be able to rollback', async () => {
    expect(await rollback()).to.equal(true);
  });
  it('should be able to migrate to latest again', async () => {
    expect(await migrateToLatest()).to.equal(true);
  });
});
