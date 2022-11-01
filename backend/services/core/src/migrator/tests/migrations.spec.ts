/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import { knex } from '../../shared';

const migrations = fs.readdirSync('migrations');
const lastMigration = migrations[migrations.length - 1];

async function isAtLatest() {
  const current = await knex.migrate.currentVersion();
  return lastMigration.startsWith(current);
}

function getSchema() {
  return knex
    .raw(`SELECT
      table_name,
      column_name,
      column_default,
      is_nullable,
      data_type
      FROM information_schema.columns WHERE table_schema = 'public';`)
    .then((res) => res.rows);
}

function compareSchemas(up: Array<any>, down: Array<any>) {
  if (up.length !== down.length) {
    throw Error(`Schema length mismatch (up: ${up.length}, down: ${down.length})`);
  }

  function getMatchingDown(c: any) {
    return down.find((d) => d.table_name === c.table_name && d.column_name === c.column_name);
  }

  up.forEach((column) => {
    const upJson = JSON.stringify(column, null, 2);
    const downJson = JSON.stringify(getMatchingDown(column), null, 2);
    if (upJson !== downJson) {
      throw Error(`Schema mismatch\n up: ${upJson}\n down: ${downJson}`);
    }
  });
}

async function testMigrations() {
  const schemaStates = [];
  console.log('Migration tests started');
  while (!await isAtLatest()) {
    schemaStates.push(await getSchema());
    await knex.migrate.up();
    console.log('upgraded to version', await knex.migrate.currentVersion());
  }

  while (schemaStates.length > 0) {
    await knex.migrate.down();
    console.log('downgraded to version', await knex.migrate.currentVersion());
    const schema = await getSchema();
    compareSchemas(schemaStates.pop(), schema);
    console.log('schema matched');
  }
}

testMigrations()
  .then(() => {
    console.log('Migration tests successful');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Migration tests failed');
    console.error(e);
    process.exit(1);
  });
