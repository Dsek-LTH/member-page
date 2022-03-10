import { UserInputError } from 'apollo-server';
import { context, dbUtils, UUID } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export function convertSong(song: sql.SongWithCategory): gql.Song {
  return {
    title: song.stitle,
    id: song.id,
    lyrics: song.lyrics,
    createdAt: song.created_at,
    updatedAt: song.updated_at,
    melody: song.melody,
    category: {
      slug: song.slug,
      title: song.ctitle,
      description: song.description,
    },
  };
}

export default class Songs extends dbUtils.KnexDataSource {
  getSong(ctx: context.UserContext, id: UUID): Promise<gql.Song> {
    return this.withAccess('songs:read', ctx, async () => {
      const song: sql.SongWithCategory = await dbUtils.unique(this.knex('songs')
        .join('categories as c', 'c.slug', 'songs.category_slug')
        .select('c.title as ctitle', 'songs.title as stitle', '*')
        .where({ id }));

      if (!song) throw new UserInputError('id did not exist');

      return convertSong(song);
    });
  }

  getSongs(
    ctx: context.UserContext,
    page: number,
    perPage: number,
  ): Promise<gql.SongPagination> {
    return this.withAccess('songs:read', ctx, async () => {
      const songs: sql.SongWithCategory[] = await this.knex<sql.SongWithCategory>('songs')
        .join('categories as c', 'c.slug', 'songs.category_slug')
        .select('c.title as ctitle', 'songs.title as stitle', '*')
        .offset(page * perPage)
        .orderBy('stitle', 'desc')
        .limit(perPage);

      const convertedSongs = songs.map((song) => convertSong(song));

      const numberOfSongs = parseInt((await this.knex<sql.Song>('songs').count({ count: '*' }))[0].count?.toString() || '0', 10);
      const pageInfo = dbUtils.createPageInfo(<number>numberOfSongs, page, perPage);

      return {
        songs: convertedSongs,
        pageInfo,
      };
    });
  }

  removeSong(ctx: context.UserContext, id: UUID): Promise<gql.Song> {
    return this.withAccess('song:delete', ctx, async () => {
      const song = await dbUtils.unique(this.knex('songs')
        .join('categories as c', 'c.slug', 'songs.category_slug')
        .select('c.title as ctitle', 'songs.title as stitle', '*')
        .where({ id }));

      if (!song) throw new UserInputError('id did not exist');
      await this.knex<sql.Song>('songs').where({ id }).del();

      return convertSong(song);
    });
  }
}
