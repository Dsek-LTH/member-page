import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { ArticlePagination, Article, PaginationInfo } from '../src/types/graphql';
import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';

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
`

const GET_ARTICLE = gql`
query getArticle($id: Int!) {
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
  }
}
`


const articles: Article[] = [
  { id: 1, header: 'H1', body: 'B1', author: {id: 1}, publishedDatetime: new Date(), headerEn: 'H1_en', bodyEn: 'B1_en'},
  { id: 2, header: 'H2', body: 'B2', author: {id: 2}, publishedDatetime: new Date(), headerEn: 'H2_en', bodyEn: 'B2_en' },
  //@ts-ignore null can't be assigned to undefined, even though it is the same
  { id: 3, header: 'H3', body: 'B3', author: {id: 3}, publishedDatetime: new Date(), headerEn: null, bodyEn: null },
  //@ts-ignore null can't be assigned to undefined, even though it is the same
  { id: 4, header: 'H4', body: 'B4', author: {id: 4}, publishedDatetime: new Date(), headerEn: null, bodyEn: null },
]

const pageInfo: PaginationInfo = {
  totalPages: 1,
  totalItems: 4,
  page: 1,
  perPage: 4,
  hasNextPage: false,
  hasPreviousPage: false,
}

const pagination: ArticlePagination = {
  articles: articles,
  pageInfo: pageInfo,
}

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
  })

  beforeEach(() => {
    sandbox.on(dataSources.newsAPI, 'getArticles', (page, perPage) => {
      return new Promise(resolve => resolve(pagination))
    })
    sandbox.on(dataSources.newsAPI, 'getArticle', (id) => {
      return new Promise(resolve => resolve(articles.find(a => a.id == id)))
    })
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[news]', () => {

    it('returns pagination of news', async () => {
      const variables = {page: 1, perPage: 3}
      const { data } = await client.query({query: GET_NEWS, variables: variables});

      expect(dataSources.newsAPI.getArticles).to.have.been.called();
      expect(data).to.deep.equal({news: pagination});
    })
  })

  describe('[article]', () => {

    it('returns an article based on id', async () => {
      const { data } = await client.query({query: GET_ARTICLE, variables: {id: 1}});

      expect(dataSources.newsAPI.getArticle).to.have.been.called();
      expect(data).to.deep.equal({article: articles[0]});
    })
  })
})