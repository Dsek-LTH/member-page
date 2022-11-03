/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import constructTestServer from '../util';
import {
  ArticlePagination, Article, PaginationInfo, Markdown, Token, Tag,
} from '~/src/types/graphql';
import { DataSources } from '~/src/datasources';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const GET_MARKDOWNS = gql`
  query GetMarkdowns {
    markdowns {
      name
      markdown
      markdown_en
    }
  }
`;

const GET_MARKDOWN = gql`
  query GetMarkdown($name: String!) {
    markdown(name: $name) {
      name
      markdown
      markdown_en
    }
  }
`;

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
        __typename
        ... on Member { id }
        ... on Mandate { id }
      }
      publishedDatetime
      isLikedByMe
      likes
      tags {
        id
        name
        nameEn
        color
        icon
      }
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
      __typename
      ... on Member { id }
      ... on Mandate { id }
    }
    publishedDatetime
    isLikedByMe
    likes
    tags {
      id
      name
      nameEn
      color
      icon
    }
  }
}
`;

const GET_TAGS = gql`
  query getTags {
    tags {
      id
      name
      nameEn
      color
      icon
    }
  }
`;

const GET_TOKEN = gql`
  query getToken($expoToken: String!) {
    token(expoToken: $expoToken) {
      id
      expoToken
      memberId
      tagSubscriptions {
        id
        name
        nameEn
        color
        icon
      }
    }
  }
`;

const markdowns: Markdown[] = [
  {
    name: 'cafe',
    markdown: 'Här finns det information om kaféet',
    markdown_en: 'Here you can find information about the café',
  },
  {
    name: 'dsek.infu',
    markdown: 'information om oss på infU',
    markdown_en: '',
  },
  {
    name: 'dsek.aktu',
    markdown: 'information om oss på aktu',
    markdown_en: '',
  },
];

const tags: Tag[] = [
  {
    id: '101010',
    name: 'tagg1',
    nameEn: 'tag1',
    color: '#ff0000',
    icon: 'edit',
  },
  {
    id: '202020',
    name: 'tagg2',
    nameEn: 'tagg2',
    color: '#ff0000',
    icon: 'edit',
  },
];

const articles: Article[] = [
  {
    id: '059bb6e4-2d45-4055-af77-433610a2ad00', header: 'H1', body: 'B1', author: { id: 'd6e39f18-0247-4a48-a493-c0184af0fecd', __typename: 'Member' }, publishedDatetime: new Date(), headerEn: 'H1_en', bodyEn: 'B1_en', likes: 0, isLikedByMe: false, tags: [tags[0]],
  },
  {
    id: '059bb6e4-2d45-4055-af77-433610a2ad01', header: 'H2', body: 'B2', author: { id: 'd6e39f18-0247-4a48-a493-c0184af0fecd', __typename: 'Member' }, publishedDatetime: new Date(), headerEn: 'H2_en', bodyEn: 'B2_en', likes: 0, isLikedByMe: false, tags: [tags[0], tags[1]],
  },
  {
    // @ts-ignore null can't be assigned to undefined, even though it is the same
    id: '059bb6e4-2d45-4055-af77-433610a2ad02', header: 'H3', body: 'B3', author: { id: 'd6e39f18-0247-4a48-a493-c0184af0fecd', __typename: 'Member' }, publishedDatetime: new Date(), headerEn: null, bodyEn: null, likes: 0, isLikedByMe: false, tags: [tags[1]],
  },
  {
    // @ts-ignore null can't be assigned to undefined, even though it is the same
    id: '059bb6e4-2d45-4055-af77-433610a2ad03', header: 'H4', body: 'B4', author: { id: 'd6e39f18-0247-4a48-a493-c0184af0fecd', __typename: 'Mandate' }, publishedDatetime: new Date(), headerEn: null, bodyEn: null, likes: 0, isLikedByMe: false, tags: [],
  },
];

const tokens: Token[] = [
  {
    id: '131313',
    expoToken: 'Token1',
    memberId: 'member1',
    tagSubscriptions: [
      tags[0],
      tags[1],
    ],
  },
  {
    id: '232323',
    expoToken: 'Token2',
    // @ts-ignore
    memberId: null,
    tagSubscriptions: [
      tags[0],
    ],
  },
  {
    id: '333333',
    expoToken: 'Token3',
    // @ts-ignore
    memberId: null,
    tagSubscriptions: [],
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
    sandbox.on(dataSources.markdownsAPI, 'getMarkdowns', () => Promise.resolve(markdowns));
    sandbox.on(dataSources.markdownsAPI, 'getMarkdown', (_, name) => Promise.resolve(markdowns.find((markdown) => markdown.name === name)));
    sandbox.on(dataSources.newsAPI, 'getArticles', () => Promise.resolve(pagination));
    sandbox.on(dataSources.newsAPI, 'getArticle', (_, id) => Promise.resolve(articles.find((a) => a.id === id)));
    sandbox.on(dataSources.newsAPI, 'getTags', (id) => Promise.resolve(articles.find((a) => a.id === id)?.tags));
    sandbox.on(dataSources.tagsAPI, 'getTags', () => Promise.resolve(tags));
    sandbox.on(dataSources.notificationsAPI, 'getToken', (expoToken) => Promise.resolve(tokens.find((t) => t.expoToken === expoToken)));
    sandbox.on(dataSources.notificationsAPI, 'getSubscribedTags', (id) => Promise.resolve(tokens.find((t) => t.id === id)?.tagSubscriptions));
    sandbox.on(dataSources.memberAPI, 'getMember', (ctx, { id }) => articles.find((article) => article.author.id === id)?.author);
    sandbox.on(dataSources.mandateAPI, 'getMandate', (ctx, { id }) => articles.find((article) => article.author.id === id)?.author);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('[markdowns]', () => {
    it('returns all markdowns', async () => {
      const { data, errors } = await client.query({ query: GET_MARKDOWNS });
      expect(errors).to.be('undefined');
      expect(dataSources.markdownsAPI.getMarkdowns).to.have.been.called();
      expect(data).to.deep.equal({ markdowns });
    });
  });

  describe('[markdown]', () => {
    it('returns one markdown', async () => {
      const { data, errors } = await client.query({ query: GET_MARKDOWN, variables: { name: 'cafe' } });
      expect(errors).to.be('undefined');
      expect(dataSources.markdownsAPI.getMarkdown).to.have.been.called();
      expect(data).to.deep.equal({ markdown: markdowns[0] });
    });
  });

  describe('[news]', () => {
    it('returns pagination of news', async () => {
      const variables = { page: 1, perPage: 3 };
      const { data, errors } = await client.query({ query: GET_NEWS, variables });
      expect(errors, 'There should not be any GraphQL errors').to.be('undefined');
      expect(dataSources.newsAPI.getArticles).to.have.been.called();
      expect(data).to.deep.equal({ news: pagination });
    });
  });

  describe('[article]', () => {
    it('returns an article based on id', async () => {
      const { data, errors } = await client.query({ query: GET_ARTICLE, variables: { id: '059bb6e4-2d45-4055-af77-433610a2ad00' } });

      expect(errors, 'There should not be any GraphQL errors').to.be('undefined');
      expect(dataSources.newsAPI.getArticle).to.have.been.called();
      expect(data).to.deep.equal({ article: articles[0] });
    });
  });

  describe('[tags]', () => {
    it('returns all tags', async () => {
      const { data, errors } = await client.query({ query: GET_TAGS });
      expect(errors, 'There should not be any GraphQL errors').to.be('undefined');
      expect(dataSources.tagsAPI.getTags).to.have.been.called();
      expect(data).to.deep.equal({ tags });
    });
  });

  describe('[tokens]', () => {
    it('returns token given expo token', async () => {
      const promises = tokens.map(async (token) => {
        const { data, errors } = await client.query({
          query: GET_TOKEN,
          variables: { expoToken: token.expoToken },
        });
        expect(errors).to.be('undefined');
        expect(dataSources.notificationsAPI.getToken).to.have.been.called();
        expect(data).to.deep.equal({ token });
      });
      await Promise.all(promises);
    });
  });
});
