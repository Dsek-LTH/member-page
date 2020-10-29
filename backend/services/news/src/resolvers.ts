import { DbArticle, getAllArticles } from './db';

export default {
  Article: {
    author(article: DbArticle) {
      return { __typename: "Member", id: article.author_id}
    }
  },
  Query: {
    async news() {
      return await getAllArticles();
    }
  }
}