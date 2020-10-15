const knex = require('knex')({
  client: 'sqlite',
  connection: {
    filename: './dummy.db',
  },
  useNullAsDefault: true,
})

module.exports = knex;