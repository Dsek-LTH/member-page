import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from 'dsek-shared';
import { UserInputError } from 'apollo-server';
import NewsAPI from '../src/datasources/News';
import * as sql from '../src/types/database';
import * as gql from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createArticles: Partial<sql.CreateArticle>[] = [
  {
    header: 'H1', body: 'B1', published_datetime: new Date(), header_en: 'H1_en', body_en: 'B1_en',
  },
  {
    header: 'H2', body: 'B2', published_datetime: new Date(), image_url: 'http://example.com/public/image.png',
  },
  { header: 'H3', body: 'B3', published_datetime: new Date() },
  { header: 'H4', body: 'B4', published_datetime: new Date() },
  { header: 'H5', body: 'B5', published_datetime: new Date() },
  { header: 'H6', body: 'B6', published_datetime: new Date() },
];

const convert = (a: sql.Article): gql.Article => {
  const {
    author_id, published_datetime, header_en, body_en, image_url, latest_edit_datetime, ...rest
  } = a;
  return {
    author: { id: author_id },
    headerEn: header_en ?? undefined,
    bodyEn: body_en ?? undefined,
    publishedDatetime: new Date(published_datetime),
    imageUrl: image_url ?? undefined,
    latestEditDatetime: latest_edit_datetime ?? undefined,
    ...rest,
  };
};

let articles: sql.Article[];
let members: any[];
let keycloak: any[];

const insertArticles = async () => {
  members = await knex('members').insert([{ student_id: 'ab1234cd-s' }, { student_id: 'ef4321gh-s' }, { student_id: 'dat12abc' }]).returning('*');
  keycloak = await knex('keycloak').insert([{ keycloak_id: '1', member_id: members[0].id }, { keycloak_id: '2', member_id: members[1].id }, { keycloak_id: '3', member_id: members[2].id }]).returning('*');
  articles = await knex('articles').insert(createArticles.map((a, i) => ({ ...a, author_id: members[Math.floor(i / 2)].id }))).returning('*');
};

const newsAPI = new NewsAPI(knex);

describe('[NewsAPI]', () => {
  beforeEach(() => {
    sandbox.on(newsAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    await knex('articles').del();
    await knex('keycloak').del();
    await knex('members').del();
    sandbox.restore();
  });

  describe('[getArticles]', () => {
    it('returns an ArticlePagination', async () => {
      await insertArticles();
      const res = await newsAPI.getArticles({}, 2, 2);
      const articleSlice = articles.slice(4, 6);
      expect(res).to.deep.equal({
        articles: articleSlice.map(convert),
        pageInfo: {
          totalPages: 3,
          totalItems: 6,
          page: 2,
          perPage: 2,
          hasNextPage: false,
          hasPreviousPage: true,
        },
      });
    });
  });

  describe('[getArticle]', () => {
    it('returns a single article', async () => {
      await insertArticles();
      const article = articles[1];
      const res = await newsAPI.getArticle({}, article.id);
      expect(res).to.deep.equal(convert(article));
    });

    it('returns undefined if id does not exist', async () => {
      const res = await newsAPI.getArticle({}, '4625ad91-a451-44e4-9407-25e0d6980e1a');
      expect(res).to.be.undefined;
    });
  });

  describe('[createArticle]', () => {
    it('creates an article and returns it', async () => {
      await insertArticles();
      const header = 'H1';
      const body = 'B1';
      const keycloakId = keycloak[0].keycloak_id;
      const userId = members[0].id;
      const now = new Date();
      const gqlArticle = {
        header,
        body,
      };

      const res = await newsAPI.createArticle({ user: { keycloak_id: keycloakId } }, gqlArticle);
      if (res) {
        const { publishedDatetime, ...rest } = res.article;
        expect(rest).to.deep.equal(
          {
            id: rest.id,
            header,
            body,
            author: { id: userId },
            headerEn: undefined,
            bodyEn: undefined,
            imageUrl: undefined,
            latestEditDatetime: undefined,
          },
        );
        expect(publishedDatetime).to.be.at.least(now);
      } else {
        expect.fail('res is undefined');
      }
    });

    it('creates an article with english and returns it', async () => {
      await insertArticles();
      const headerEn = 'H1_en';
      const bodyEn = 'B1_en';
      const graphqlArticle = {
        header: 'H1',
        headerEn,
        body: 'B1',
        bodyEn,
      };

      const res = await newsAPI.createArticle({ user: { keycloak_id: '1' } }, graphqlArticle);
      if (res) {
        expect(res.article.headerEn).to.equal(headerEn);
        expect(res.article.bodyEn).to.equal(bodyEn);
      } else {
        expect.fail('res is undefined');
      }
    });
  });

  describe('[updateArticle]', () => {
    it('throws an error if id is missing', async () => {
      await insertArticles();
      const graphqlArticle = {
        header: 'H1',
        headerEn: 'H2',
      };

      try {
        await newsAPI.updateArticle({}, graphqlArticle, '4625ad91-a451-44e4-9407-25e0d6980e1a');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('updates and returns an article', async () => {
      await insertArticles();
      const article = articles[0];
      const graphqlArticle = {
        header: article.header,
        headerEn: article.header_en,
        body: article.body,
        bodyEn: article.body_en,
      };

      await newsAPI.updateArticle({}, graphqlArticle, article.id);
    });

    it('updates english translations', async () => {
      await insertArticles();
      const article = articles[0];
      const graphqlArticle = {
        header: article.header,
        headerEn: article.header_en,
        body: article.body,
        bodyEn: article.body_en,
      };

      await newsAPI.updateArticle({}, graphqlArticle, article.id);
    });
  });

  describe('[removeArticle]', () => {
    it('throws an error if id is missing', async () => {
      await insertArticles();
      try {
        await newsAPI.removeArticle({}, '4625ad91-a451-44e4-9407-25e0d6980e1a');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes and returns an article', async () => {
      await insertArticles();
      const article = articles[0];
      const res = await newsAPI.removeArticle({}, article.id);

      expect(res?.article).to.deep.equal(convert(article));
    });
  });
});
