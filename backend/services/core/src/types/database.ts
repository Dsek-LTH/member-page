export type Keycloak = {
  keycloak_id: string,
  member_id: number,
}

export type Member = {
  id: number,
  student_id: string,
  first_name: string,
  nickname: string,
  last_name: string,
  class_programme: string,
  class_year: number,
  picture_path: string,
}

export type Committee = {
  id: number,
  name: string,
  name_en: string | null,
}

export type Position = {
  id: string,
  name: string,
  name_en: string | null,
  committee_id: number | null,
}

export type Mandate = {
  id: number,
  member_id: number,
  position_id: string,
  start_date: Date,
  end_date: Date,
}

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type CreatePosition = Position
export type CreateCommittee = Create<Committee, 'name', 'id'>

type Update<T, O extends keyof T> = Partial<Omit<T, O>>
export type UpdatePosition = Update<Position, 'id'>
export type UpdateCommittee = Update<Committee, 'id'>

