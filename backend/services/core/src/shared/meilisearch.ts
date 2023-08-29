import { Knex } from 'knex';
import MeiliSearch from 'meilisearch';
import { createLogger } from '.';
import { Member } from '../types/database';
import { Event } from '../types/events';
import { Article } from '../types/news';

const logger = createLogger('meilisearch-admin');

class MeilisearchAdmin {
  meilisearch: MeiliSearch;

  constructor() {
    this.meilisearch = new MeiliSearch({
      host: process.env.MEILI_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILI_MASTER_KEY || 'password',
    });
  }

  // function to add data to index in chunks of 500
  private async addDataToIndexByChunks(index: string, data: any[], size: number = 500) {
    for (let i = 0; i < data.length; i += size) {
      // eslint-disable-next-line no-await-in-loop
      await this.meilisearch.index(index).addDocuments(data.slice(i, i + size));
    }
  }

  async addArticleToSearchIndex(article: Article) {
    if (false && process.env.NODE_ENV !== 'test') {
      const index = this.meilisearch.index('articles');
      await index.addDocuments([{
        id: article.id,
        header: article.header,
        header_en: article.header_en,
        body: article.body,
        body_en: article.body_en,
        slug: article.slug,
        image_url: article.image_url,
        author_id: article.author_id,
        published_datetime: article.published_datetime,
      }]);
    }
  }

  async addMemberToSearchIndex(member: Member) {
    if (false && process.env.NODE_ENV !== 'test' && process.env.HEROKU !== 'true') {
      const index = this.meilisearch.index('members');
      await index.addDocuments([{
        id: member.id,
        student_id: member.student_id,
        first_name: member.first_name,
        nick_name: member.nickname,
        last_name: member.last_name,
        picture_path: member.picture_path,
      }]);
    }
  }

  async indexMembersMeilisearch(knex: Knex) {
    logger.info('Indexing members in meilisearch.');
    try {
      await this.meilisearch.deleteIndexIfExists('members');
      const members = await knex.select('id', 'student_id', 'first_name', 'nickname', 'last_name', 'picture_path').from('members');
      await this.addDataToIndexByChunks('members', members);
      logger.info('Meilisearch members index successful');
      return true;
    } catch (e: any) {
      logger.info('Meilisearch members index failed');
      logger.error(e);
      return false;
    }
  }

  async indexEventsMeilisearch(knex: Knex) {
    logger.info('Indexing events in meilisearch.');
    try {
      await this.meilisearch.deleteIndexIfExists('events');
      const events = await knex
        .select('id', 'slug', 'title', 'title_en', 'location', 'organizer', 'description', 'description_en', 'short_description', 'short_description_en', 'start_datetime', 'end_datetime')
        .from('events')
        .whereNull('removed_at');
      this.addDataToIndexByChunks('events', events);
      logger.info('Meilisearch events index successful');
      return true;
    } catch (e: any) {
      logger.info('Meilisearch events index failed');
      logger.error(e);
      return false;
    }
  }

  async indexArticlesMeilisearch(knex: Knex) {
    logger.info('Indexing articles in meilisearch.');
    try {
      await this.meilisearch.deleteIndexIfExists('articles');
      const articles = await knex
        .select('id', 'header', 'header_en', 'body', 'body_en', 'slug', 'image_url', 'author_id', 'published_datetime')
        .from('articles').whereNull('removed_at');
      await this.addDataToIndexByChunks('articles', articles);
      logger.info('Meilisearch articles index successful');
      return true;
    } catch (e: any) {
      logger.info('Meilisearch articles index failed');
      logger.error(e);
      return false;
    }
  }

  async addEventToSearchIndex(event: Event) {
    if (false && process.env.NODE_ENV !== 'test') {
      const index = this.meilisearch.index('events');
      await index.addDocuments([{
        id: event.id,
        slug: event.slug,
        title: event.title,
        title_en: event.title_en,
        location: event.location,
        organizer: event.organizer,
        description: event.description,
        description_en: event.description_en,
        short_description: event.short_description,
        short_description_en: event.short_description_en,
        start_datetime: event.start_datetime,
        end_datetime: event.end_datetime,
      }]);
    }
  }

  async indexMeilisearch(knex: Knex) {
    logger.info('Indexing meilisearch.');
    return await this.indexMembersMeilisearch(knex)
  && await this.indexEventsMeilisearch(knex)
  && await this.indexArticlesMeilisearch(knex);
  }
}

const meilisearchAdmin = new MeilisearchAdmin();
export default meilisearchAdmin;
