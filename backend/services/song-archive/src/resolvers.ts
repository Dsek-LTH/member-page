import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext> = {
  Query: {
    songs(_, { page, perPage }, { user, roles, dataSources }) {
      return dataSources.songsAPI.getSongs({ user, roles }, page, perPage);
    },
    song(_, { id }, { user, roles, dataSources }) {
      return dataSources.songsAPI.getSong({ user, roles }, id);
    },
  },
  Mutation: {
    song: () => ({}),
  },
  SongMutations: {
    // create(_, { input }, { user, roles, dataSources }) {
    //   return dataSources.songsAPI.createSong({ user, roles }, input);
    // },
    // update(_, { id, input }, { user, roles, dataSources }) {
    //   return dataSources.songsAPI.updateSong({ user, roles }, input, id);
    // },
    remove(_, { id }, { user, roles, dataSources }) {
      return dataSources.songsAPI.removeSong({ user, roles }, id);
    },
  },
};

export default resolvers;
