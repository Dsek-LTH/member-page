import { gql } from 'apollo-server';

export const songs = [{
  id: 'bee37543-43b6-4956-bd5b-6b16f89464ec',
  category: 'category',
  created_at: new Date('2022-01-01'),
  title: 'title',
  updated_at: null,
  lyrics: 'lyrics',
  melody: 'melody',
},
{
  id: '092769f9-906e-4260-9e64-aec695f53658',
  category: 'category',
  created_at: new Date('2022-01-01'),
  title: 'title2',
  updated_at: null,
  lyrics: 'lyrics2',
  melody: 'melody2',
}];

export const GetSongsQuery = gql`
  query Songs {
    songs {
      id
      title
      lyrics
      melody
      category
      created_at
      updated_at
    }
  }
`;

export const GetSongByTitleQuery = gql`
  query SongByTitle($title: String!) {
    songByTitle(title: $title) {
      id
      title
      lyrics
      melody
      category
      created_at
      updated_at
    }
  }
`;

export const GetSongById = gql`
  query SongById($id: UUID!) {
    songById(id: $id) {
      id
      title
      lyrics
      melody
      category
      created_at
      updated_at
    }
  }
`;
