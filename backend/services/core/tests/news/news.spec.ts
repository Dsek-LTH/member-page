import chai, { expect } from 'chai';
import spies from 'chai-spies';
import 'mocha';

import { ApolloError, UserInputError } from 'apollo-server';
import { DataSources } from '~/src/datasources';
import MemberAPI from '~/src/datasources/Member';
import NewsAPI, { JoinedArticle, convertArticle, convertTag } from '~/src/datasources/News';
import { knex } from '~/src/shared';
import { slugify } from '~/src/shared/utils';
import { Author } from '~/src/types/author';
import { ArticleRequestStatus, CreateArticle } from '~/src/types/graphql';
import * as sql from '~/src/types/news';
import createTags from './tags.spec';
import AuthorAPI from '~/src/datasources/Author';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createArticles: Partial<sql.CreateArticle>[] = [
  {
    header: 'H1', body: 'B1', published_datetime: new Date('2020-06-01'), header_en: 'H1_en', body_en: 'B1_en',
  },
  {
    header: 'H2', body: 'B2', published_datetime: new Date('2020-05-01'), image_url: 'http://example.com/public/image.png',
  },
  { header: 'H3', body: 'B3', published_datetime: new Date('2020-04-01') },
  { header: 'H4', body: 'B4', published_datetime: new Date('2020-03-01') },
  { header: 'H5', body: 'B5', published_datetime: new Date('2020-02-01') },
  { header: 'H6', body: 'B6', published_datetime: new Date('2020-01-01') },
  {
    header: 'Draft 1', body: 'draft body', status: ArticleRequestStatus.Draft,
  },
  {
    header: 'Draft 2', body: 'draft body 2', status: ArticleRequestStatus.Draft,
  },
  {
    header: 'Rejected 1', body: 'rejected body', status: ArticleRequestStatus.Rejected,
  },
];

let articles: JoinedArticle[];
let authors: Author[];
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
  keycloak = await knex('keycloak').insert([{ keycloak_id: '1', member_id: members[0].id }, { keycloak_id: '2', member_id: members[1].id }, { keycloak_id: 'create_request', member_id: members[2].id }]).returning('*');
  await knex('positions').insert({ id: 'position', name: 'Position' });
  mandates = await knex('mandates').insert([{
    member_id: members[0].id, position_id: 'position', start_date: '2022-01-01', end_date: '2022-12-31',
  }]).returning('*');
  authors = await knex<Author>('authors').insert([
    { member_id: members[0].id, type: 'Member' },
    { member_id: members[0].id, mandate_id: mandates[0].id, type: 'Mandate' },
    { member_id: members[1].id, type: 'Member' },
    { member_id: members[1].id, type: 'Member' },
    { member_id: members[2].id, type: 'Member' },
    { member_id: members[2].id, type: 'Member' },
    { member_id: members[2].id, type: 'Member' },
    { member_id: members[2].id, type: 'Member' },
    { member_id: members[2].id, type: 'Member' },
  ]).returning('*');
  articles = await knex('articles').insert([
    { ...createArticles[0], author_id: authors[0].id },
    { ...createArticles[1], author_id: authors[1].id },
    { ...createArticles[2], author_id: authors[2].id },
    { ...createArticles[3], author_id: authors[3].id },
    { ...createArticles[4], author_id: authors[4].id },
    { ...createArticles[5], author_id: authors[5].id },
    { ...createArticles[6], author_id: authors[6].id },
    { ...createArticles[7], author_id: authors[7].id },
    { ...createArticles[8], author_id: authors[8].id },
  ]).returning('*');
  articles = articles.map((article, index) => ({
    ...article,
    author: authors[index],
    member: members.find((member) => member.id === authors[index].member_id),
  }));
};

const insertArticleRequests = async () => {
  await knex('article_requests').insert([
    {
      article_id: articles[6].id,
    },
    {
      article_id: articles[7].id,
    },
    {
      article_id: articles[8].id,
      rejection_reason: 'Rejected reason',
      rejected_datetime: new Date('2020-01-01'),
      handled_by: members[0].id,
    },
  ]);
};
const insertTags = async () => {
  tags = await knex('tags').insert(createTags).returning('*');
};

const newsAPI = new NewsAPI(knex);
const memberAPI = new MemberAPI(knex);
const authorAPI = new AuthorAPI(knex);
const dataSources: DataSources = {
  newsAPI,
  memberAPI,
  authorAPI,
} as DataSources;

describe('[NewsAPI]', () => {
  beforeEach(() => {
    sandbox.on(newsAPI, 'withAccess', (name, context, fn) => {
      if (name === 'news:article:manage') {
        if (context?.user?.keycloak_id === keycloak[2].keycloak_id) {
          return Promise.reject(new ApolloError('Not authorized', 'NOT_AUTHORIZED'));
        }
      }
      return fn();
    });
    sandbox.on(newsAPI, 'hasAccess', (name, context) => {
      if (name === 'news:article:manage') {
        if (context?.user?.keycloak_id === keycloak[2].keycloak_id) return false;
      }
      return true;
    });
    sandbox.on(memberAPI, 'withAccess', (name, context, fn) => {
      if (name === 'news:article:manage') {
        if (context?.user?.keycloak_id === keycloak[2].keycloak_id) {
          return Promise.reject(new ApolloError('Not authorized', 'NOT_AUTHORIZED'));
        }
      }
      return fn();
    });
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
    await knex('article_requests').del();
    sandbox.restore();
  });

  describe('[getArticles]', () => {
    it('returns an ArticlePagination', async () => {
      await insertArticles();
      const res = await newsAPI.getArticles({}, 3, 2);
      const articleSlice = articles.slice(4, 6);
      expect(res).to.deep.equal({
        articles: articleSlice.map((article) =>
          convertArticle({ article, numberOfLikes: 0, isLikedByMe: false }, {})),
        pageInfo: {
          totalPages: 3,
          totalItems: 6,
          page: 3,
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
      const res = await newsAPI.getArticle({}, dataSources, article.id);
      expect(res).to.deep.equal(convertArticle(
        { article, numberOfLikes: 0, isLikedByMe: false },
        {},
      ));
    });

    it('returns undefined if id does not exist', async () => {
      const res = await newsAPI.getArticle({}, dataSources, '4625ad91-a451-44e4-9407-25e0d6980e1a');
      expect(res).to.be.undefined;
    });
  });

  describe('[getArticleRequests]', () => {
    it('returns all draft requests', async () => {
      await insertArticles();
      await insertArticleRequests();
      const res = await newsAPI.getArticleRequests(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
      );
      expect(res).to.not.be.undefined;
      expect(res?.length).to.equal(2);
      expect(res?.[0].status).to.equal(ArticleRequestStatus.Draft);
      expect(res?.[1].status).to.equal(ArticleRequestStatus.Draft);
    });
  });

  describe('[getArticleRequest]', () => {
    it('returns a single draft article', async () => {
      await insertArticles();
      await insertArticleRequests();
      const article = articles[6];
      const res = await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,

        article.id,
      );
      expect(res).to.not.be.undefined;
      expect(res?.status).to.equal(ArticleRequestStatus.Draft);
    });
    it('returns a single rejected article', async () => {
      await insertArticles();
      await insertArticleRequests();
      const article = articles[8];
      const res = await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
        article.id,
      );
      expect(res).to.not.be.undefined;
      expect(res?.status).to.equal(ArticleRequestStatus.Rejected);
      expect(res?.rejectionReason).to.be.equal('Rejected reason');
    });

    it('returns undefined if id does not exist', async () => {
      const res = await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,

        '4625ad91-a451-44e4-9407-25e0d6980e1a',
      );
      expect(res).to.be.undefined;
    });
  });

  describe('[getRejectedRequests]', () => {
    it('returns all rejected requests', async () => {
      await insertArticles();
      await insertArticleRequests();
      const res = await newsAPI.getRejectedArticles(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
        0,
        10,
      );
      expect(res?.articles).to.not.be.undefined;
      expect(res?.articles.length).to.equal(1);
      expect(res?.articles?.[0]?.status).to.equal(ArticleRequestStatus.Rejected);
    });
  });

  describe('[createArticle]', () => {
    it('throws ApolloError if keycloak id is missing', async () => {
      await insertArticles();

      await expectToThrow(
        () => newsAPI.createArticle({ user: { keycloak_id: '-1' } }, { header: 'H1', body: 'B1' }, dataSources),
        ApolloError,
      );
    });

    it('creates an article and returns it', async () => {
      await insertArticles();
      const header = 'H1';
      const body = 'B1';
      const keycloakId = keycloak[0].keycloak_id;
      const gqlArticle = {
        header,
        body,
      };

      const before = new Date();
      const res = await newsAPI.createArticle(
        { user: { keycloak_id: keycloakId } },
        gqlArticle,
        dataSources,
      )
        ?? expect.fail('res is undefined');

      const { publishedDatetime, createdDatetime, ...rest } = res.article;
      expect(rest).to.deep.equal({
        id: rest.id,
        author: {
          member: members[0], type: 'Member', customAuthor: undefined, mandate: undefined, id: rest.author.id,
        },
        header,
        body,
        likes: 0,
        slug: `${slugify(header)}-1`,
        handledBy: undefined,
        isLikedByMe: false,
        bodyEn: undefined,
        headerEn: undefined,
        imageUrl: undefined,
        latestEditDatetime: undefined,
        removed_at: null,
        tags: [],
        comments: [],
        likers: [],
        status: ArticleRequestStatus.Approved,
      });
      expect(createdDatetime).to.be.at.least(before);
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

      const res = await newsAPI.createArticle({ user: { keycloak_id: '1' } }, graphqlArticle, dataSources)
        ?? expect.fail('res is undefined');

      expect(res.article.headerEn).to.equal(headerEn);
      expect(res.article.bodyEn).to.equal(bodyEn);
    });

    it('creates an article associated with a mandate', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: '1' } }, { header: 'H1', body: 'B1', author: { mandateId: mandates[0].id } }, dataSources))
        ?? expect.fail('res is undefined');

      expect(res.article.author.mandate?.id).to.equal(mandates[0].id);
      expect(res.article.author.member?.id).to.equal(mandates[0].member_id);
    });

    it('throws UserInputError if mandate is missing', async () => {
      await insertArticles();

      expectToThrow(
        () => newsAPI.createArticle({ user: { keycloak_id: '1' } }, { header: 'H1', body: 'B1', author: { mandateId: '4a79fc59-9ae4-44d8-8eb6-1ab69ab8b4a2' } }, dataSources),
        UserInputError,
      );
    });

    it('creates an article request', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: keycloak[2].keycloak_id } }, { header: 'H1', body: 'B1' }, dataSources))
        ?? expect.fail('res is undefined');
      const request = (await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
        res.article.id,
      ));
      const allRequests = await newsAPI.getArticleRequests(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
      );
      expect(request).to.not.be.undefined;
      expect(request?.handledBy).to.be.undefined;
      expect(request?.status).to.equal(ArticleRequestStatus.Draft);
      expect(request?.publishedDatetime).to.be.undefined;
      expect(allRequests).to.have.length(1);
      expect(allRequests[0].id).to.equal(request?.id);
    });

    it('creates an article with tags', async () => {
      await insertArticles();
      await insertTags();

      const header = 'H1';
      const body = 'B1';
      const keycloakId = keycloak[0].keycloak_id;

      const gqlArticle: CreateArticle = {
        header,
        body,
        tagIds: tags.map((t) => t.id), // all tags
      };

      const before = new Date();
      const res = await newsAPI.createArticle(
        { user: { keycloak_id: keycloakId } },
        gqlArticle,
        dataSources,
      )
        ?? expect.fail('res is undefined');

      const { publishedDatetime, createdDatetime, ...rest } = res.article;
      expect(rest).to.deep.equal({
        id: rest.id,
        author: {
          member: members[0], type: 'Member', id: rest.author.id, customAuthor: undefined, mandate: undefined,
        },
        header,
        body,
        likes: 0,
        slug: `${slugify(header)}-1`,
        handledBy: undefined,
        isLikedByMe: false,
        bodyEn: undefined,
        headerEn: undefined,
        imageUrl: undefined,
        removed_at: null,
        latestEditDatetime: undefined,
        tags: tags.map((t) => convertTag(t)),
        comments: [],
        likers: [],
        status: ArticleRequestStatus.Approved,
      });
      expect(createdDatetime).to.be.at.least(before);
      expect(publishedDatetime).to.be.at.least(before);
    });

    it('creates an article with empty tags', async () => {
      await insertArticles();
      await insertTags();

      const header = 'H1';
      const body = 'B1';
      const keycloakId = keycloak[0].keycloak_id;

      const gqlArticle: CreateArticle = {
        header,
        body,
        tagIds: [], // no tags
      };

      const before = new Date();
      const res = await newsAPI.createArticle(
        { user: { keycloak_id: keycloakId } },
        gqlArticle,
        dataSources,
      )
        ?? expect.fail('res is undefined');

      const { publishedDatetime, createdDatetime, ...rest } = res.article;
      expect(rest).to.deep.equal({
        id: rest.id,
        author: {
          id: rest.author.id, member: members[0], mandate: undefined, customAuthor: undefined, type: 'Member',
        },
        header,
        body,
        likes: 0,
        slug: `${slugify(header)}-1`,
        handledBy: undefined,
        isLikedByMe: false,
        bodyEn: undefined,
        headerEn: undefined,
        imageUrl: undefined,
        removed_at: null,
        latestEditDatetime: undefined,
        status: ArticleRequestStatus.Approved,
        tags: [],
        comments: [],
        likers: [],
      });
      expect(createdDatetime).to.be.at.least(before);
      expect(publishedDatetime).to.be.at.least(before);
    });
  });

  describe('[approveArticle]', () => {
    it('approves an article request', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: keycloak[2].keycloak_id } }, { header: 'H1', body: 'B1' }, dataSources))
        ?? expect.fail('res is undefined');
      const request = (await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
        res.article.id,
      ));
      expect(request?.status).to.equal(ArticleRequestStatus.Draft);
      const before = new Date();
      await newsAPI.approveArticle(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        res.article.id,
      );
      const request2 = (await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
        res.article.id,
      ));
      expect(request2?.status).to.equal(ArticleRequestStatus.Approved);
      expect(request2?.handledBy?.id).to.equal(members[0].id);
      expect(request2?.publishedDatetime).to.be.at.least(before);
    });
    it('throws an error if user is not admin', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: keycloak[2].keycloak_id } }, { header: 'H1', body: 'B1' }, dataSources))
        ?? expect.fail('res is undefined');
      await expectToThrow(() => newsAPI.approveArticle(
        { user: { keycloak_id: keycloak[2].keycloak_id } },
        res.article.id,
      ), ApolloError);
    });
    it('throws an error if article request does not exist', async () => {
      await expectToThrow(
        () => newsAPI.approveArticle(
          { user: { keycloak_id: keycloak[0].keycloak_id } },
          '4625ad91-a451-44e4-9407-25e0d6980e1a',
        ),
        UserInputError,
      );
    });
  });

  describe('[rejectArticle]', () => {
    it('rejects an article request', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: keycloak[2].keycloak_id } }, { header: 'H1', body: 'B1' }, dataSources))
        ?? expect.fail('res is undefined');
      const request = (await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
        res.article.id,
      ));
      expect(request?.status).to.equal(ArticleRequestStatus.Draft);
      await newsAPI.rejectArticle(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        res.article.id,
        'reason',
      );
      const request2 = (await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
        res.article.id,
      ));
      expect(request2?.status).to.equal(ArticleRequestStatus.Rejected);
      expect(request2?.handledBy?.id).to.equal(members[0].id);
      expect(request2?.rejectionReason).to.equal('reason');
      expect(request2?.publishedDatetime).to.be.undefined;
    });
    it('throws an error if user is not admin', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: keycloak[2].keycloak_id } }, { header: 'H1', body: 'B1' }, dataSources))
        ?? expect.fail('res is undefined');
      await expectToThrow(() => newsAPI.rejectArticle(
        { user: { keycloak_id: keycloak[2].keycloak_id } },
        res.article.id,
      ), ApolloError);
    });
    it('throws an error if article request does not exist', async () => {
      await expectToThrow(
        () => newsAPI.rejectArticle(
          { user: { keycloak_id: keycloak[0].keycloak_id } },
          '4625ad91-a451-44e4-9407-25e0d6980e1a',
        ),
        UserInputError,
      );
    });
  });

  describe('[undoRejection]', () => {
    it('undos a rejection', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: keycloak[2].keycloak_id } }, { header: 'H1', body: 'B1' }, dataSources))
        ?? expect.fail('res is undefined');
      await newsAPI.rejectArticle(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        res.article.id,
        'reason',
      );
      const request = (await newsAPI.getArticleRequest(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        dataSources,
        res.article.id,
      ));
      expect(request?.status).to.equal(ArticleRequestStatus.Rejected);
      expect(request?.handledBy?.id).to.equal(members[0].id);
      expect(request?.rejectionReason).to.equal('reason');
      expect(request?.rejectedDatetime).to.not.be.undefined;
      expect(request?.publishedDatetime).to.be.undefined;
      const updatedRequest = (await newsAPI.undoRejection(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        res.article.id,
      ));
      expect(updatedRequest?.status).to.equal(ArticleRequestStatus.Draft);
      expect(updatedRequest?.handledBy).to.be.undefined;
      expect(updatedRequest?.rejectedDatetime).to.be.undefined;
      expect(updatedRequest?.rejectionReason).to.be.undefined;
      expect(updatedRequest?.publishedDatetime).to.be.undefined;
    });

    it('throws an error if article is not rejected', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: keycloak[2].keycloak_id } }, { header: 'H1', body: 'B1' }, dataSources))
        ?? expect.fail('res is undefined');
      await expectToThrow(() => newsAPI.undoRejection(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        res.article.id,
      ), UserInputError);
    });

    it('throws an error if user is not admin', async () => {
      await insertArticles();
      const res = (await newsAPI.createArticle({ user: { keycloak_id: keycloak[2].keycloak_id } }, { header: 'H1', body: 'B1' }, dataSources))
        ?? expect.fail('res is undefined');
      await newsAPI.rejectArticle(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        res.article.id,
        'reason',
      );
      await expectToThrow(() => newsAPI.undoRejection(
        { user: { keycloak_id: keycloak[2].keycloak_id } },
        res.article.id,
      ), ApolloError);
    });

    it('throws an error if article does not exist', async () => {
      await expectToThrow(() => newsAPI.undoRejection(
        { user: { keycloak_id: keycloak[0].keycloak_id } },
        '4625ad91-a451-44e4-9407-25e0d6980e1a',
      ), UserInputError);
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
        () => newsAPI.updateArticle({}, dataSources, graphqlArticle, '4625ad91-a451-44e4-9407-25e0d6980e1a'),
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

      await newsAPI.updateArticle({}, dataSources, graphqlArticle, article.id);
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

      await newsAPI.updateArticle({}, dataSources, graphqlArticle, article.id);
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
        convertArticle({ article, numberOfLikes: 1, isLikedByMe: true }, {}),
      );
    });

    it('likes mutiple articles', async () => {
      await insertArticles();
      const article1 = articles[0];
      const article2 = articles[1];
      const res1 = await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article1.id);
      const res2 = await newsAPI.likeArticle({ user: { keycloak_id: '2' } }, article2.id);

      expect(res1?.article).to.deep.equal(
        convertArticle({ article: article1, numberOfLikes: 1, isLikedByMe: true }, {}),
      );
      expect(res2?.article).to.deep.equal(
        convertArticle({ article: article2, numberOfLikes: 1, isLikedByMe: true }, {}),
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
        convertArticle({ article, numberOfLikes: 0, isLikedByMe: false }, {}),
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
        convertArticle({ article: article1, numberOfLikes: 0, isLikedByMe: false }, {}),
      );
      expect(res2?.article).to.deep.equal(
        convertArticle({ article: article2, numberOfLikes: 0, isLikedByMe: false }, {}),
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
        await newsAPI.removeArticle({}, dataSources, '4625ad91-a451-44e4-9407-25e0d6980e1a');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes and returns an article', async () => {
      await insertArticles();
      const article = articles[0];
      const res = await newsAPI.removeArticle({}, dataSources, article.id);

      expect(res?.article).to.deep.equal(
        convertArticle({ article, numberOfLikes: 0, isLikedByMe: false }, {}),
      );
    });
  });
});
