import { dbUtils, context, UUID } from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/songs';

export default class SongAPI extends dbUtils.KnexDataSource {
  songs(ctx: context.UserContext): Promise<gql.Song[]> {
    return this.withAccess('songs:read', ctx, async () => this.knex<sql.Song>('songs'));
  }

  songById(id: UUID, ctx: context.UserContext): Promise<gql.Maybe<gql.Song>> {
    return this.withAccess('songs:read', ctx, async () => this.knex<sql.Song>('songs').where({ id }).first());
  }

  songByTitle(title: string, ctx: context.UserContext): Promise<gql.Maybe<gql.Song>> {
    return this.withAccess('songs:read', ctx, async () => this.knex<sql.Song>('songs').where({ title }).first());
  }
}
