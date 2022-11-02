// Update with your config settings.

interface Configs {
  [key: string]: object
}

const defaults = {
  client: 'pg',
  version: process.env.POSTGRES_VERSION,
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

const configs: Configs = {
  development: {
    ...defaults,
  },
  production: {
    ...defaults,
  },
  test: {
    ...defaults,
    version: '14',
    connection: {
      host: 'localhost',
      port: 9999,
      user: 'user',
      password: 'password',
      database: 'dsek',
    },
  },
};

export default configs;
