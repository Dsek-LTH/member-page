exports.up = (knex) =>
  knex.schema
    .renameTable('mail_aliases', 'email_aliases')
    .table('email_aliases', (table) => {
      table.renameColumn('email_alias', 'email');
    });

exports.down = (knex) =>
  knex.schema
    .renameTable('email_aliases', 'mail_aliases')
    .table('mail_aliases', (table) => {
      table.renameColumn('email', 'email_alias');
    });
