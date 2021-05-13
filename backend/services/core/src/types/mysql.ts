export type DbKeycloak = {
  keycloak_id: string,
  member_id: number,
}

export type DbMember = {
  id: number,
  student_id: string,
  first_name: string,
  nickname: string,
  last_name: string,
  class_programme: string,
  class_year: number,
  picture_path: string,
}

export type DbCommittee = {
  id: number,
  name: string,
  name_en: string | null,
}

export type DbPosition = {
  id: number,
  name: string,
  name_en: string | null,
  committee_id: number | null,
}

export type DbMandate = {
  id: number,
  member_id: number,
  position_id: number,
  start_date: Date,
  end_date: Date,
}

type DbCreate<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type DbCreatePosition = DbCreate<DbPosition, 'name', 'id'>
export type DbCreateCommittee = DbCreate<DbCommittee, 'name', 'id'>

type DbUpdate<T, O extends keyof T> = Partial<Omit<T, O>>
export type DbUpdatePosition = DbUpdate<DbPosition, 'id'>
export type DbUpdateCommittee = DbUpdate<DbCommittee, 'id'>

