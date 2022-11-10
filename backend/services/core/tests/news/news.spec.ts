import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { ApolloError, UserInputError } from 'apollo-server';
import { knex } from '~/src/shared';
import NewsAPI, { convertArticle, convertTag } from '~/src/datasources/News';
import * as sql from '~/src/types/news';
import { CreateArticle } from '~/src/types/graphql';
import createTags from './tags.spec';
import { slugify } from '~/src/shared/utils';

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
let tags: sql.Tag[];

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

const insertTags = async () => {
  tags = await knex('tags').insert(createTags).returning('*');
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
    await knex('tags').del();
    await knex('article_likes').del();
    await knex('article_tags').del();
    sandbox.restore();
  });

  describe('[getArticles]', () => {
    it('returns an ArticlePagination', async () => {
      await insertArticles();
      const res = await newsAPI.getArticles({}, 2, 2);
      const articleSlice = articles.slice(4, 6);
      expect(res).to.deep.equal({
        articles: articleSlice.map((article) =>
          convertArticle({ article, numberOfLikes: 0, isLikedByMe: false })),
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
      expect(res).to.deep.equal(convertArticle({ article, numberOfLikes: 0, isLikedByMe: false }));
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
        likes: 0,
        slug: `${slugify(header)}-1`,
        isLikedByMe: false,
        bodyEn: undefined,
        headerEn: undefined,
        imageUrl: undefined,
        latestEditDatetime: undefined,
        tags: [],
        comments: [],
        likers: [],
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

    it('creates an article with tags', async () => {
      await insertArticles();
      await insertTags();

      const header = 'H1';
      const body = 'B1';
      const keycloakId = keycloak[0].keycloak_id;
      const userId = members[0].id;

      const gqlArticle: CreateArticle = {
        header,
        body,
        tagIds: tags.map((t) => t.id), // all tags
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
        likes: 0,
        slug: `${slugify(header)}-1`,
        isLikedByMe: false,
        bodyEn: undefined,
        headerEn: undefined,
        imageUrl: undefined,
        latestEditDatetime: undefined,
        tags: tags.map((t) => convertTag(t)),
        comments: [],
        likers: [],
      });
      expect(publishedDatetime).to.be.at.least(before);
    });

    it('creates an article with empty tags', async () => {
      await insertArticles();
      await insertTags();

      const header = 'H1';
      const body = 'B1';
      const keycloakId = keycloak[0].keycloak_id;
      const userId = members[0].id;

      const gqlArticle: CreateArticle = {
        header,
        body,
        tagIds: [], // no tags
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
        likes: 0,
        slug: `${slugify(header)}-1`,
        isLikedByMe: false,
        bodyEn: undefined,
        headerEn: undefined,
        imageUrl: undefined,
        latestEditDatetime: undefined,
        tags: [],
        comments: [],
        likers: [],
      });
      expect(publishedDatetime).to.be.at.least(before);
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
        tagIds: [],
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

    it('adds a tag', async () => {
      await insertArticles();
      await insertTags();
      const articleId = articles[0].id;
      const newTag = [tags[0].id];

      await newsAPI.addTags({}, articleId, newTag);
      const res = await newsAPI.getTags(articleId);
      expect(res).to.deep.equal([convertTag(tags[0])]);
    });

    it('adds multiple tags', async () => {
      await insertArticles();
      await insertTags();
      const articleId = articles[0].id;
      const newTags = tags.map((t) => t.id);

      await newsAPI.addTags({}, articleId, newTags);
      const res = await newsAPI.getTags(articleId);
      expect(res).to.deep.equal(tags.map((t) => convertTag(t)));
    });

    it('removes tags', async () => {
      await insertArticles();
      await insertTags();
      const articleId = articles[0].id;
      const newTag = [tags[0].id];

      await newsAPI.addTags({}, articleId, newTag);
      const res1 = await newsAPI.getTags(articleId);
      expect(res1).to.deep.equal([convertTag(tags[0])]);

      await newsAPI.removeTags({}, articleId, newTag);
      const res2 = await newsAPI.getTags(articleId);
      expect(res2).to.deep.equal([]);
    });
  });

  describe('[likeArticle]', () => {
    it('throws an error if id is missing', async () => {
      await insertArticles();
      try {
        await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, '4625ad91-a451-44e4-9407-25e0d6980e1a');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('likes and returns an article', async () => {
      await insertArticles();
      const article = articles[0];
      const res = await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article.id);

      expect(res?.article).to.deep.equal(
        convertArticle({ article, numberOfLikes: 1, isLikedByMe: true }),
      );
    });

    it('likes mutiple articles', async () => {
      await insertArticles();
      const article1 = articles[0];
      const article2 = articles[1];
      const res1 = await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article1.id);
      const res2 = await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article2.id);

      expect(res1?.article).to.deep.equal(
        convertArticle({ article: article1, numberOfLikes: 1, isLikedByMe: true }),
      );
      expect(res2?.article).to.deep.equal(
        convertArticle({ article: article2, numberOfLikes: 1, isLikedByMe: true }),
      );
    });

    it('throws an error when liking an already liked article', async () => {
      await insertArticles();
      const article = articles[5];
      await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article.id);
      try {
        await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article.id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });
  });

  describe('[unlikeArticle]', () => {
    it('throws an error if id is missing', async () => {
      await insertArticles();
      try {
        await newsAPI.unlikeArticle({ user: { keycloak_id: '2' } }, '4625ad91-a451-44e4-9407-25e0d6980e1a');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('unlikes and returns an article', async () => {
      await insertArticles();
      const article = articles[0];
      await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article.id);
      const res = await newsAPI.unlikeArticle({ user: { keycloak_id: '2' } }, article.id);

      expect(res?.article).to.deep.equal(
        convertArticle({ article, numberOfLikes: 0, isLikedByMe: false }),
      );
    });

    it('unlikes multiple articles', async () => {
      await insertArticles();
      const article1 = articles[0];
      const article2 = articles[1];
      await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article1.id);
      await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article2.id);
      const res1 = await newsAPI.unlikeArticle({ user: { keycloak_id: '2' } }, article1.id);
      const res2 = await newsAPI.unlikeArticle({ user: { keycloak_id: '2' } }, article2.id);

      expect(res1?.article).to.deep.equal(
        convertArticle({ article: article1, numberOfLikes: 0, isLikedByMe: false }),
      );
      expect(res2?.article).to.deep.equal(
        convertArticle({ article: article2, numberOfLikes: 0, isLikedByMe: false }),
      );
    });

    it('throws an error when disliking an non liked article', async () => {
      await insertArticles();
      const article = articles[0];
      await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article.id);
      await newsAPI.unlikeArticle({ user: { keycloak_id: '2' } }, article.id);
      try {
        await newsAPI.unlikeArticle({ user: { keycloak_id: '2' } }, article.id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
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

      expect(res?.article).to.deep.equal(
        convertArticle({ article, numberOfLikes: 0, isLikedByMe: false }),
      );
    });
  });
});
