export type DbSong = {
  id: number,
  name: string,
  lyrics: string,
  writer_id: number,
  writer_name: string,
  category: string,
  melody: string,
  created: number,
  edited: number,
}

type DbCreate<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type DbCreateSong = DbCreate<DbSong, 'name' | 'lyrics', 'id'>

type DbUpdate<T, O extends keyof T> = Partial<Omit<T, O>>
export type DbUpdateSong = DbUpdate<DbSong, 'id'>

