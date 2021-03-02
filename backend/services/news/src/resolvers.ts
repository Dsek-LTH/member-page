import { DbArticle, getAllArticles, getArticles } from './db';

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
  }
}