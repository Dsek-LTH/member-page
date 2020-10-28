// Update with your config settings.

interface Configs {
  [key: string]: object
}

const defaults = {
  client: 'mysql2',
  version: process.env.MYSQL_VERSION,
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

const configs: Configs = {
  development: {
    ...defaults,
  },
  production: {
    ...defaults,
  }
};

export default configs;