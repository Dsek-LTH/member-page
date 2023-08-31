import type { Knex } from 'knex';
import insertMarkdowns from './helpers/insertMarkdowns';
import insertExpoTokens from './helpers/insertExpoTokens';
import insertMembers from './helpers/insertMembers';
import insertCommittees from './helpers/insertCommittees';
import insertPositions from './helpers/insertPositions';
import insertMandates from './helpers/insertMandates';
import insertArticles from './helpers/insertArticles';
import deleteExistingEntries from './helpers/deleteExistingEntries';
import insertArticleCommentsAndLikes from './helpers/insertArticleComments';
import insertKeycloakRelations from './helpers/insertKeycloakRelations';
import insertEvents from './helpers/insertEvents';
import insertEventComments from './helpers/insertEventComments';
import insertTags from './helpers/insertTags';
import insertBookableCategories from './helpers/insertBookableCategories';
import insertBookables from './helpers/insertBookables';
import insertBookingRequests from './helpers/insertBookings';
import insertDoors from './helpers/insertDoors';
import insertDoorAccessPolicies from './helpers/insertDoorAccessPolicies';
import insertMailAlias from './helpers/insertMailAlias';
import insertProducts from './helpers/insertProducts';
import { ArticleTag, Alert } from '../src/types/news';
import insertApiAccessPolicies from './helpers/insertApiAccessPolicies';
import insertGoverningDocuments from './helpers/insertGoverningDocuments';
import { insertSubscriptionSettings, insertNotifications } from './helpers/notifications';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex) => {
  // Deletes ALL existing entries
  await deleteExistingEntries(knex);

  await insertApiAccessPolicies(knex);

  await insertMarkdowns(knex);

  await insertExpoTokens(knex);

  // Inserts seed entries
  const memberIds = await insertMembers(knex).then((members) => members.map((member) => member.id));

  const committeesIds = await insertCommittees(knex);

  const positionIds = await insertPositions(knex, committeesIds);

  const mandateIds = await insertMandates(knex, memberIds, positionIds);

  const tagIds = await insertTags(knex);

  const articleIds = await insertArticles(knex, memberIds, mandateIds);
  await knex<ArticleTag>('article_tags').insert([{
    article_id: articleIds[1],
    tag_id: tagIds[0],
  },
  {
    article_id: articleIds[1],
    tag_id: tagIds[1],
  },
  {
    article_id: articleIds[2],
    tag_id: tagIds[1],
  }]);
  await knex<ArticleTag>('article_requests').insert({
    article_id: articleIds[2],
  });

  await insertArticleCommentsAndLikes(knex, articleIds, memberIds);

  await insertKeycloakRelations(knex, memberIds);

  const eventIds = await insertEvents(knex, memberIds);

  await insertEventComments(knex, eventIds, memberIds);

  const bookableCategoryIds = await insertBookableCategories(knex);

  const bookableIds = await insertBookables(knex, bookableCategoryIds);

  await insertBookingRequests(knex, memberIds, bookableIds);

  await insertSubscriptionSettings(knex, memberIds);

  await insertNotifications(knex, memberIds);

  await insertDoors(knex);

  await insertDoorAccessPolicies(knex);

  await insertMailAlias(knex);

  await insertProducts(knex);

  await knex<Alert>('alerts').insert([{
    severity: 'warning',
    message: 'Du är i en utvecklingsmiljö',
    message_en: 'You are in a development environment',
    created_at: new Date(),
  }]);

  await insertGoverningDocuments(knex);
};
