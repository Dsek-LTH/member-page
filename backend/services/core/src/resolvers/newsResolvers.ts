import { context } from '../shared';
import { DataSources } from '../datasources';
import { Mandate, Member, Resolvers } from '../types/graphql';

interface DataSourceContext {
  dataSources: DataSources;
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    news(_, { page, perPage }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticles({ user, roles }, page, perPage);
    },
    article(_, { id, slug }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, id, slug);
    },
    markdown(_, { name }, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.getMarkdown({ user, roles }, name);
    },
    markdowns(_, __, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.getMarkdowns({ user, roles });
    },
    tag(_, { id }, { user, roles, dataSources }) {
      return dataSources.tagsAPI.getTag({ user, roles }, id);
    },
    tags(_, __, { user, roles, dataSources }) {
      return dataSources.tagsAPI.getTags({ user, roles });
    },
    token(_, { expoToken }, { dataSources }) {
      return dataSources.notificationsAPI.getToken(expoToken);
    },
  },
  Mutation: {
    article: () => ({}),
    markdown: () => ({}),
    token: () => ({}),
    tags: () => ({}),
  },
  Article: {
    __resolveReference({ id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.getArticle({ user, roles }, id);
    },
    async author(article, _, { user, roles, dataSources }) {
      if (article.author.__typename === 'Member') {
        const member: Member = {
          ...await dataSources
            .memberAPI.getMember({ user, roles }, { id: article.author.id }),
          __typename: 'Member',
          id: article.author.id,
        };
        return member;
      }
      const mandate: Mandate = {
        start_date: '',
        end_date: '',
        ...await dataSources
          .mandateAPI.getMandate({ user, roles }, article.author.id),
        __typename: 'Mandate',
        id: article.author.id,
      };
      return mandate;
    },
    likes({ id }, _, { dataSources }) {
      return dataSources.newsAPI.getLikes(id);
    },
    isLikedByMe({ id }, _, { user, dataSources }) {
      return dataSources.newsAPI.isLikedByUser(
        id,
        user?.keycloak_id,
      );
    },
    tags({ id }, _, { dataSources }) {
      return dataSources.newsAPI.getTags(id);
    },
  },
  Token: {
    __resolveReference({ id }, { dataSources }) {
      return dataSources.notificationsAPI.getToken(id);
    },
    tagSubscriptions({ id }, _, { dataSources }) {
      return dataSources.notificationsAPI.getSubscribedTags(id);
    },
  },
  ArticleMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.newsAPI.createArticle({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.newsAPI.updateArticle({ user, roles }, input, id);
    },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.removeArticle({ user, roles }, id);
    },
    like(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.likeArticle({ user, roles }, id);
    },
    dislike(_, { id }, { user, roles, dataSources }) {
      return dataSources.newsAPI.dislikeArticle({ user, roles }, id);
    },
  },
  MarkdownMutations: {
    update(_, { name, input }, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.updateMarkdown(
        { user, roles },
        input,
        name,
      );
    },
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.markdownsAPI.createMarkdown({ user, roles }, input);
    },
  },
  TagMutations: {
    create(_, { input }, { user, roles, dataSources }) {
      return dataSources.tagsAPI.createTag({ user, roles }, input);
    },
    update(_, { id, input }, { user, roles, dataSources }) {
      return dataSources.tagsAPI.updateTag({ user, roles }, input, id);
    },
  },
  TokenMutations: {
    register(_, { expoToken }, { user, roles, dataSources }) {
      return dataSources.notificationsAPI.registerToken({ user, roles }, expoToken);
    },
    subscribe(_, { expoToken, tagIds }, { dataSources }) {
      return dataSources.notificationsAPI.subscribeTags(expoToken, tagIds);
    },
    unsubscribe(_, { expoToken, tagIds }, { dataSources }) {
      return dataSources.notificationsAPI.unsubscribeTags(expoToken, tagIds);
    },
  },
};

export default resolvers;
