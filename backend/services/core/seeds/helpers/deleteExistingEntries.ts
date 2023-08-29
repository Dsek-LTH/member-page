import { Knex } from 'knex';
import { TABLE } from '../../src/datasources/WebshopAPI';

export default async function deleteExistingEntries(knex: Knex) {
  await knex('api_access_policies').del();
  await knex('songs').del();
  await knex('notifications').del();
  await knex('events').del();
  await knex('articles').del();
  await knex('mandates').del();
  await knex('email_aliases').del();
  await knex('positions').del();
  await knex('committees').del();
  await knex('members').del();
  await knex('keycloak').del();
  await knex('booking_bookables').del();
  await knex('booking_requests').del();
  await knex('bookables').del();
  await knex('door_access_policies').del();
  await knex('doors').del();
  await knex('markdowns').del();
  await knex('tags').del();
  await knex('expo_tokens').del();
  await knex('article_comments').del();
  await knex('article_likes').del();
  await knex('event_comments').del();
  await knex(TABLE.CART_ITEM).del();
  await knex(TABLE.CART).del();
  await knex(TABLE.PRODUCT_INVENTORY).del();
  await knex(TABLE.PRODUCT).del();
  await knex(TABLE.PRODUCT_CATEGORY).del();
  await knex(TABLE.PRODUCT_DISCOUNT).del();
  await knex('alerts').del();
  await knex('governing_documents').del();
  await knex('custom_authors').del();
  await knex('custom_author_roles').del();
}
