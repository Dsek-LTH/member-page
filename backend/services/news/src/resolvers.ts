import { DbArticle, getAllArticles } from './db';

export default {
  Article: {
    author(article: DbArticle) {
      return { __typename: "Member", stil_id: article.author_stil_id}
    }
  },
  Query: {
    async news() {
      return await getAllArticles();
    }
  }
}