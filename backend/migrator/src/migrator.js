const { knex } = require('dsek-shared');

const migrate = async () => {
  for (i = 0; i < 10; i++) {
    const timeout = i * 500;
    await new Promise(resolve => setTimeout(resolve, timeout));
    try {
      const pastVersion = await knex.migrate.currentVersion();
      await knex.migrate.latest();
      const newVersion = await knex.migrate.currentVersion();
      console.log('Migration successful')
      if (pastVersion === newVersion) console.log('Already latest version')
      else console.log(`migrated from ${pastVersion} to ${newVersion}`)
      return true;
    } catch (e) {
      console.error(`MIGRATION ATTEMPT ${i} FAILED`);
      console.error(e);
    }
  }
  return false;
}

const seed = async () => {
  try {
    const [ seeds ] = await knex.seed.run();
    console.log('Seed successful')
    console.log('Seeds applied:')
    seeds.forEach(s => console.log(`\t${s}`))
  } catch (e) {
    console.error('SEEDS FAILED');
    console.error(e);
  }
}

const run = async () => {
  console.log('MIGRATE')
  const success = (process.argv.includes('migrate'))
    ? await migrate()
    : (() => {console.log('No migrations applied'); return true})();
  console.log('===================')
  console.log('SEED')
  if (process.env.NODE_ENV !== 'production' && success && process.argv.includes('seed')) await seed();
  else console.log('No seeds applied')
  console.log('===================')
  console.log('DONE');
}

run();
