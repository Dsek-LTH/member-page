import { UUID, ApiAccessPolicy } from 'dsek-shared'
export type Keycloak = {
  keycloak_id: string,
  member_id: UUID,
}

export type Member = {
  id: UUID,
  student_id: string,
  first_name: string,
  nickname: string,
  last_name: string,
  class_programme: string,
  class_year: number,
  picture_path: string,
}

export type Committee = {
  id: UUID,
  name: string,
  name_en: string | null,
}

export type Position = {
  id: string,
  name: string,
  name_en: string | null,
  committee_id: UUID | null,
}

export type Mandate = {
  id: UUID,
  member_id: UUID,
  position_id: string,
  start_date: Date,
  end_date: Date,
}

export type Door = {
  name: string,
  id?: string,
}

export type Api = {
  name: string,
}

export type DoorAccessPolicy = {
  id: UUID,
  door_name: string,
  role?: string,
  student_id?: string,
}

// ApiAccessPolicy in shared/src/database.ts.

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type CreatePosition = Position
export type CreateCommittee = Create<Committee, 'name', 'id'>
export type CreateApiAccessPolicy = Create<ApiAccessPolicy, 'api_name', 'id'>
export type CreateDoorAccessPolicy = Create<DoorAccessPolicy, 'door_name', 'id'>

type Update<T, O extends keyof T> = Partial<Omit<T, O>>
export type UpdatePosition = Update<Position, 'id'>
export type UpdateCommittee = Update<Committee, 'id'>

