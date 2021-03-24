import { DbArticle, getArticles, getArticle } from './db';

export default {
  Article: {
    author(article: DbArticle) {
      return { __typename: "Member", id: article.author_id}
    }
  },
  Query: {
    news({}, {page, perPage}: {page: number, perPage: number}) {
      return getArticles(page, perPage);
    },
    article({}, {id} : {id: number}){
      return getArticle(id);
    }
  },
}