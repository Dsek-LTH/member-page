import knex from 'knex';

export default knex({
  client: 'sqlite',
  connection: {
    filename: './dummy.db',
  },
  useNullAsDefault: true,
})