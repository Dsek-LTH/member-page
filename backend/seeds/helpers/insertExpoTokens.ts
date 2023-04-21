import { Knex } from 'knex';
import { Token } from '~/src/types/notifications';

export default async function insertExpoTokens(knex: Knex) {
  await knex<Token>('expo_tokens').insert([
    {
      expo_token: 'ExponentPushToken[B4AZYePawteHqeeM9FnfQq]',
    },
  ]);
}
