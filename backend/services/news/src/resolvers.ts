import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { DbArticle, getArticles, createArticle, updateArticle, removeArticle } from './db';

export default {
  Article: {
    author(article: DbArticle) {
      return { __typename: "Member", id: article.author_id}
    }
  },
  Query: {
    news({}, {page, perPage}: {page: number, perPage: number}) {
      return getArticles(page, perPage);
    }
  },
  Mutation: {
    article: () => ({}),
  },
  ArticleMutations: {
    create: ({}, {input}: {input: {header: string, body: string}}, {user}: context.UserContext) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return createArticle(input.header, input.body, user.keycloak_id);
    },
    update: ({}, {id, input}: {id: number, input: {header: string, body: string}}, {user}: context.UserContext) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return updateArticle(id, input.header, input.body);
    },
    remove: ({}, {id}: {id: number}, {user}: context.UserContext) => {
      if (!user) throw new AuthenticationError('Operation denied');
      return removeArticle(id);
    },
  },
};