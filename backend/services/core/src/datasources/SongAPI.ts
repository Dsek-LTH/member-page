import { dbUtils, context } from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/songs';

export default class SongAPI extends dbUtils.KnexDataSource {
  getSongs(ctx: context.UserContext): Promise<gql.Song[]> {
    return this.withAccess('songs:read', ctx, async () => {
      const songs = await this.knex<sql.Song>('songs');
      return songs;
    });
  }
}
