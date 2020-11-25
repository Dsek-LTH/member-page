import { context } from 'dsek-shared';
import { DataSources } from './datasources';
import { Resolvers } from './types/graphql';

interface DataSourceContext {
  dataSources: DataSources
}

const resolvers: Resolvers<context.UserContext & DataSourceContext>= {
  Query: {
    songs: (_, {filter}, {dataSources}) => {
      //TODO: call function from data source
      return undefined;
    },
  },
  Song: {
    __resolveReference: (song, {dataSources}) => {
      //return dataSources.memberAPI.getMember(member);
      return undefined;
    },
    writer: (song) => {
      if (song.writer?.__typename == 'Member')
        return  { __typename: "Member", id: 1};
    }
  },
  Mutation: {
    song: () => ({}),
  },
  SongMutations: {
    create: (_, {input}, {user, roles, dataSources}) => {
      return false;
    },
    update: (_, {id, input}, {user, roles, dataSources}) => {
      return false;
    },
    remove: (_, {id}, {user, roles, dataSources}) => {
      return false;
    }
  },
}

export default resolvers;
