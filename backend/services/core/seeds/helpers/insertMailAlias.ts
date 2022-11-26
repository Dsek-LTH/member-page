import { Knex } from 'knex';
import { MailAlias } from '~/src/types/database';

export default async function insertMailAlias(knex: Knex): Promise<void> {
  await knex<MailAlias>('email_aliases').insert([
    { position_id: 'dsek.infu.dwww', email: 'dwww@dsek.se' },
    { position_id: 'dsek.infu.dwww', email: 'dwww-medlem@dsek.se' },
    { position_id: 'dsek.infu.dwww.mastare', email: 'dwww@dsek.se' },
    { position_id: 'dsek.infu.dwww.mastare', email: 'dwww-ansvarig@dsek.se' },
  ]);
}
