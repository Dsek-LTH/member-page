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
    createArticle: ({}, {header, body}: {header: string, body: string}) => {
      return createArticle(header, body);
    },
    updateArticle: ({}, {id, header, body}: {id: number, header: string, body: string}) => {
      return updateArticle(id, header, body);
    },
    removeArticle: ({}, {id}: {id: number}) => {
      return removeArticle(id);
    },
  },
}