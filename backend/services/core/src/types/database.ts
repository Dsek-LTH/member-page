// eslint-disable-next-line import/no-cycle
import { UUID, ApiAccessPolicy } from '../shared';

export type MailAlias = {
  id: UUID,
  position_id: string,
  email: string,
};

export type Keycloak = {
  keycloak_id: string,
  member_id: UUID,
};

export type Member = {
  id: UUID,
  student_id: string,
  first_name: string,
  nickname: string,
  last_name: string,
  class_programme: string,
  class_year: number,
  picture_path: string,
  visible: boolean,
};

export type Committee = {
  id: UUID,
  name: string,
  name_en: string | null,
  short_name: string,
};

export type Position = {
  id: string,
  name: string,
  name_en: string | null,
  committee_id: UUID | null,
  active: boolean,
  email: string | null,
  board_member: boolean,
  description: string | null,
  description_en: string | null,
};

export type Mandate = {
  id: UUID,
  member_id: UUID,
  position_id: string,
  start_date: Date,
  end_date: Date,
  in_keycloak: boolean,
};

export type Door = {
  name: string,
  id?: string,
};

export type Api = {
  name: string,
};

export type DoorAccessPolicy = {
  id: UUID,
  door_name: string,
  role: string | null,
  student_id: string | null,
  start_datetime: Date | null,
  end_datetime: Date | null,
};

// ApiAccessPolicy in shared/src/database.ts.

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>;
export type CreatePosition = Pick<Position, 'id' | 'name'> & Partial<Position>;
export type CreateCommittee = Pick<Committee, 'name' | 'short_name'> & Partial<Committee>;
export type CreateMember = Create<Member, 'student_id', 'id'>;
export type CreateMandate = {
  member_id: UUID,
  position_id: string,
  start_date: string,
  end_date: string,
};
export type CreateApiAccessPolicy = Create<ApiAccessPolicy, 'api_name', 'id'>;
export type CreateDoorAccessPolicy = Create<DoorAccessPolicy, 'door_name', 'id'>;

type Update<T, O extends keyof T> = Partial<Omit<T, O>>;
export type UpdatePosition = Update<Position, 'id'>;
export type UpdateCommittee = Update<Committee, 'id'>;
