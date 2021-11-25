import { UUID } from 'dsek-shared';

export type Event = {
  id: UUID;
  title: string;
  title_en?: string;
  location: string;
  organizer: string;
  author_id: UUID;
  description: string;
  description_en?: string;
  short_description: string;
  short_description_en?: string;
  link: string;
  start_datetime: string;
  end_datetime: string;
};

export type Keycloak = {
  keycloak_id: string;
  member_id: UUID;
};

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type CreateEvent = Create<Event,
  'title' | 'description' | 'start_datetime' | 'end_datetime' |
  'organizer' | 'author_id' | 'short_description',
  'id'>;