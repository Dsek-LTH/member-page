import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { ArticlePagination, Article, PaginationInfo } from '../src/types/graphql';
import { DataSources } from '../src/datasources';
import constructTestServer from './util';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const GET_NEWS = gql`
query {
  news {
    articles {
      id
      header
      body
      headerEn
      bodyEn
      author {
        id
      }
      publishedDatetime
      isLiked
      likes
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`;

const GET_ARTICLE = gql`
query getArticle($id: UUID!) {
  article(id: $id) {
    id
    header
    body
    headerEn
    bodyEn
    author {
      id
    }
    publishedDatetime
    isLiked
    likes
  }
}
`;

const articles: Article[] = [
  {
    id: '059bb6e4-2d45-4055-af77-433610a2ad00', header: 'H1', body: 'B1', author: { id: 'd6e39f18-0247-4a48-a493-c0184af0fecd' }, publishedDatetime: new Date(), headerEn: 'H1_en', bodyEn: 'B1_en', isLiked: false, likes: 0,
  },
  {
    id: '059bb6e4-2d45-4055-af77-433610a2ad01', header: 'H2', body: 'B2', author: { id: 'd6e39f18-0247-4a48-a493-c0184af0fecd' }, publishedDatetime: new Date(), headerEn: 'H2_en', bodyEn: 'B2_en', isLiked: false, likes: 0,
  },
  {
    // @ts-ignore null can't be assigned to undefined, even though it is the same
    id: '059bb6e4-2d45-4055-af77-433610a2ad02', header: 'H3', body: 'B3', author: { id: 'd6e39f18-0247-4a48-a493-c0184af0fecd' }, publishedDatetime: new Date(), headerEn: null, bodyEn: null, isLiked: false, likes: 0,
  },
  {
    // @ts-ignore null can't be assigned to undefined, even though it is the same
    id: '059bb6e4-2d45-4055-af77-433610a2ad03', header: 'H4', body: 'B4', author: { id: 'd6e39f18-0247-4a48-a493-c0184af0fecd' }, publishedDatetime: new Date(), headerEn: null, bodyEn: null, isLiked: false, likes: 0,
  },
];

const pageInfo: PaginationInfo = {
  totalPages: 1,
  totalItems: 4,
  page: 1,
  perPage: 4,
  hasNextPage: false,
  hasPreviousPage: false,
};

const pagination: ArticlePagination = {
  articles,
  pageInfo,
};

describe('[Queries]', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(() => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;

    const c = createTestClient(server);
    client = c;
  });

  beforeEach(() => {
    sandbox.on(dataSources.newsAPI, 'getArticles', () => Promise.resolve(pagination));
    sandbox.on(dataSources.newsAPI, 'getArticle', (_, id) => Promise.resolve(articles.find((a) => a.id === id)));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('[news]', () => {
    it('returns pagination of news', async () => {
      const variables = { page: 1, perPage: 3 };
      const { data } = await client.query({ query: GET_NEWS, variables });

      expect(dataSources.newsAPI.getArticles).to.have.been.called();
      expect(data).to.deep.equal({ news: pagination });
    });
  });

  describe('[article]', () => {
    it('returns an article based on id', async () => {
      const { data } = await client.query({ query: GET_ARTICLE, variables: { id: '059bb6e4-2d45-4055-af77-433610a2ad00' } });

      expect(dataSources.newsAPI.getArticle).to.have.been.called();
      expect(data).to.deep.equal({ article: articles[0] });
    });
  });
});
