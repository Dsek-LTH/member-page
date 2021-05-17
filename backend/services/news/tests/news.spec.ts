import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import NewsAPI from '../src/datasources/News';
import * as sql from '../src/types/mysql';
import * as gql from '../src/types/graphql';
import { ApolloError, UserInputError } from 'apollo-server-errors';

const articles: sql.DbArticle[] = [
  { id: 1, header: 'H1', body: 'B1', author_id: 1, published_datetime: new Date(), header_en: 'H1_en', body_en: 'B1_en' },
  { id: 2, header: 'H2', body: 'B2', author_id: 1, published_datetime: new Date() },
  { id: 3, header: 'H3', body: 'B3', author_id: 2, published_datetime: new Date() },
  { id: 4, header: 'H4', body: 'B4', author_id: 2, published_datetime: new Date() },
  { id: 5, header: 'H5', body: 'B5', author_id: 3, published_datetime: new Date() },
  { id: 6, header: 'H6', body: 'B6', author_id: 3, published_datetime: new Date() },
]

const convert = (a: sql.DbArticle): gql.Article => {
  const { author_id, published_datetime, header_en, body_en,image_url, latest_edit_datetime, ...rest } = a;
  return {
    author: { id: author_id },
    headerEn: header_en,
    bodyEn: body_en,
    publishedDatetime: new Date(published_datetime),
    imageUrl: image_url,
    latestEditDatetime: latest_edit_datetime,
    ...rest,
  }
}

const user: context.UserContext = {
  user: {
    keycloak_id: 'kc_id',
    student_id: 'test2',
  },
  roles: ['dsek']
}

const tracker = mockDb.getTracker();
const newsAPI = new NewsAPI(knex);

describe('[NewsAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => tracker.install())
  afterEach(() => tracker.uninstall())

  describe('[getArticles]', () => {

    it('returns an ArticlePagination', async () => {
      const page = 2;
      const perPage = 2;
      const articleSlice = articles.slice(page * perPage, page * perPage + perPage);
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql.toLowerCase()).to.include('limit');
            expect(query.bindings).to.include(page);
            expect(query.bindings).to.include(page * perPage);
            query.response(articleSlice);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: articles.length }])
          }
        ][step - 1]()
      });
      const res = await newsAPI.getArticles(page, perPage);
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
      })
    });

  });

  describe('[getArticle]', () => {

    it('returns a single article', async () => {
      const id = 2;
      const article = articles[1]
      tracker.on('query', query => {
        expect(query.method).to.equal('select');
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.bindings).include(id)
        query.response([article])
      })

      const res = await newsAPI.getArticle(id);
      expect(res).to.deep.equal(convert(article))
    });

    it('returns undefined if id does not exist', async () => {
      const id = -1;
      tracker.on('query', query => {
        expect(query.method).to.equal('select');
        query.response([])
      })

      const res = await newsAPI.getArticle(id);
      expect(res).to.be.undefined;
    });

  });

  describe('[createArticle]', () => {

    it('throws error if missing member', async () => {
      tracker.on('query', query => {
        query.response([]);
      })

      const graphqlArticle = {
        header: 'H1',
        body: 'B1',
      }

      try {
        await newsAPI.createArticle(graphqlArticle, 'missing')
        expect.fail('Did not throw Error')
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError)
      }
    })

    it('creates an article and returns it', async () => {
      const header = 'H1';
      const body = 'B1';
      const keycloakId = '1234-asdf-1234-asdf';
      const userId = 10;
      const articleId = 2;
      const now = new Date();
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.bindings).to.include(keycloakId);
            query.response([{ member_id: userId }]);
          },
          () => {
            expect(query.method).to.equal('insert');
            [header, body, userId].forEach(v => expect(query.bindings).to.include(v))
            query.response([articleId]);
          },
        ][step - 1]()
      })

      const graphqlArticle = {
        header: header,
        body: body,
      }

      const res = await newsAPI.createArticle(graphqlArticle, keycloakId);
      if (res) {
        const { publishedDatetime, ...rest } = res.article;
        expect(rest).to.deep.equal(
          {
            id: articleId,
            header: header,
            body: body,
            author: { id: userId },
            headerEn: undefined,
            bodyEn: undefined,
            imageUrl: undefined,
            latestEditDatetime: undefined
          }
        )
        expect(publishedDatetime).to.be.at.least(now)
      } else {
        expect.fail('res is undefined')
      }
    });

    it('creates an article with english and returns it', async () => {
      const headerEn = 'H1_en';
      const bodyEn = 'B1_en';
      tracker.on('query', (query, step) => {
        [
          () => { query.response([{ member_id: '123' }]); },
          () => { query.response([2]); },
        ][step - 1]()
      })

      const graphqlArticle = {
        header: 'H1',
        headerEn: headerEn,
        body: 'B1',
        bodyEn: bodyEn,
      }

      const res = await newsAPI.createArticle(graphqlArticle, '123');
      if (res) {
        expect(res.article.headerEn).to.equal(headerEn)
        expect(res.article.bodyEn).to.equal(bodyEn)
      } else {
        expect.fail('res is undefined')
      }

    })

  });

  describe('[updateArticle]', () => {

    it('throws an error if id is missing', async () => {
      tracker.on('query', (query, step) => {
        [
          () => query.response(null),
          () => query.response([]),
        ][step - 1]()
      });

      const graphqlArticle = {
        header: 'H1',
        headerEn: 'H2',
      }

      try {
        await newsAPI.updateArticle(graphqlArticle, 1);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('updates and returns an article', async () => {
      const article = articles[0];
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('update');
            expect(query.sql).to.include('latest_edit_datetime')
            expect(query.bindings).to.include(article.header)
            expect(query.bindings).to.include(article.body)
            query.response(null);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.bindings).to.include(article.id)
            query.response([article]);
          },
        ][step - 1]()
      });

      const graphqlArticle = {
        header: article.header,
        headerEn: article.header_en,
        body: article.body,
        bodyEn: article.body_en,
      }

      await newsAPI.updateArticle(graphqlArticle, article.id);
    });

    it('updates english translations', async () => {
      const article = articles[0];
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('update');
            expect(query.bindings).to.include(article.header_en)
            expect(query.bindings).to.include(article.body_en)
            query.response(null);
          },
          () => {
            query.response([article]);
          },
        ][step - 1]()
      });

      const graphqlArticle = {
        header: article.header,
        headerEn: article.header_en,
        body: article.body,
        bodyEn: article.body_en,
      }

      await newsAPI.updateArticle(graphqlArticle, article.id);
    })

  });

  describe('[removeArticle]', () => {

    it('throws an error if id is missing', async () => {
      tracker.on('query', query => query.response([]));

      try {
        await newsAPI.removeArticle(-1);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes and returns an article', async () => {
      const article = articles[0];
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.bindings).to.include(article.id);
            query.response([article]);
          },
          () => {
            expect(query.method).to.equal('del');
            expect(query.bindings).to.include(article.id);
            query.response(1);
          },
        ][step - 1]()
      })
      const res = await newsAPI.removeArticle(article.id);

      expect(res?.article).to.deep.equal(convert(article));
    })
  })
});