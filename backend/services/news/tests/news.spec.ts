import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from 'dsek-shared';
import { ApolloError, UserInputError } from 'apollo-server';
import NewsAPI, { convertArticle } from '../src/datasources/News';
import * as sql from '../src/types/database';

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

let articles: sql.Article[];
let members: any[];
let keycloak: any[];
let mandates: any[];

const expectToThrow = async (fn: () => Promise<any>, error: any) => {
  let thrown = true;
  try {
    await fn();
    thrown = false;
  } catch (e) {
    expect(e).to.be.instanceOf(error);
  }
  if (!thrown) expect.fail('Expected to throw');
};

const insertArticles = async () => {
  members = await knex('members').insert([{ student_id: 'ab1234cd-s' }, { student_id: 'ef4321gh-s' }, { student_id: 'dat12abc' }]).returning('*');
  keycloak = await knex('keycloak').insert([{ keycloak_id: '1', member_id: members[0].id }, { keycloak_id: '2', member_id: members[1].id }, { keycloak_id: '3', member_id: members[2].id }]).returning('*');
  await knex('positions').insert({ id: 'position', name: 'Position' });
  mandates = await knex('mandates').insert([{
    member_id: members[0].id, position_id: 'position', start_date: '2022-01-01', end_date: '2022-12-31',
  }]).returning('*');
  articles = await knex('articles').insert([
    { ...createArticles[0], author_id: members[0].id, author_type: 'Member' },
    { ...createArticles[1], author_id: mandates[0].id, author_type: 'Mandate' },
    { ...createArticles[2], author_id: members[1].id, author_type: 'Member' },
    { ...createArticles[3], author_id: members[1].id, author_type: 'Member' },
    { ...createArticles[4], author_id: members[2].id, author_type: 'Member' },
    { ...createArticles[5], author_id: members[2].id, author_type: 'Member' },
  ]).returning('*');
};

const newsAPI = new NewsAPI(knex);

describe('[NewsAPI]', () => {
  beforeEach(() => {
    sandbox.on(newsAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    await knex('articles').del();
    await knex('mandates').del();
    await knex('positions').del();
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
        articles: articleSlice.map(convertArticle),
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
      expect(res).to.deep.equal(convertArticle(article));
    });

    it('returns undefined if id does not exist', async () => {
      const res = await newsAPI.getArticle({}, '4625ad91-a451-44e4-9407-25e0d6980e1a');
      expect(res).to.be.undefined;
    });
  });

  describe('[createArticle]', () => {
    it('throws ApolloError if keycloak id is missing', async () => {
      await insertArticles();

      await expectToThrow(
        () => newsAPI.createArticle({ user: { keycloak_id: '-1' } }, { header: 'H1', body: 'B1' }),
        ApolloError,
      );
    });

    it('creates an article and returns it', async () => {
      await insertArticles();
      const header = 'H1';
      const body = 'B1';
      const keycloakId = keycloak[0].keycloak_id;
      const userId = members[0].id;
      const gqlArticle = {
        header,
        body,
      };

      const before = new Date();
      const res = await newsAPI.createArticle({ user: { keycloak_id: keycloakId } }, gqlArticle)
        ?? expect.fail('res is undefined');

      const { publishedDatetime, ...rest } = res.article;
      expect(rest).to.deep.equal({
        id: rest.id,
        author: { __typename: 'Member', id: userId },
        header,
        body,
        bodyEn: undefined,
        headerEn: undefined,
        imageUrl: undefined,
        latestEditDatetime: undefined,
      });
      expect(publishedDatetime).to.be.at.least(before);
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

      const res = await newsAPI.createArticle({ user: { keycloak_id: '1' } }, graphqlArticle)
        ?? expect.fail('res is undefined');

      expect(res.article.headerEn).to.equal(headerEn);
      expect(res.article.bodyEn).to.equal(bodyEn);
    });

    it('creates an article associated with a mandate', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: '1' } }, { header: 'H1', body: 'B1', mandateId: mandates[0].id }))
        ?? expect.fail('res is undefined');

      expect(res.article.author.id).to.equal(mandates[0].id);
      expect(res.article.author.__typename).to.equal('Mandate');
    });

    it('throws UserInputError if mandate is missing', async () => {
      await insertArticles();

      expectToThrow(
        () => newsAPI.createArticle({ user: { keycloak_id: '1' } }, { header: 'H1', body: 'B1', mandateId: '4a79fc59-9ae4-44d8-8eb6-1ab69ab8b4a2' }),
        UserInputError,
      );
    });
  });

  describe('[updateArticle]', () => {
    it('throws UserInputError if id is missing', async () => {
      await insertArticles();
      const graphqlArticle = {
        header: 'H1',
        headerEn: 'H2',
      };

      await expectToThrow(
        () => newsAPI.updateArticle({}, graphqlArticle, '4625ad91-a451-44e4-9407-25e0d6980e1a'),
        UserInputError,
      );
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

      expect(res?.article).to.deep.equal(convertArticle(article));
    });
  });
});
