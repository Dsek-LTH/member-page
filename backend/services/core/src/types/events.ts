import { UUID } from '../shared';

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
  number_of_updates: number;
  alarm_active?: boolean;
  removed_at?: Date;
  slug?: string;
};

export type Keycloak = {
  keycloak_id: string;
  member_id: UUID;
};

export type MemberEventLink = {
  id: UUID;
  event_id: UUID;
  member_id: UUID;
};

export type Comment = {
  id: UUID,
  event_id: UUID,
  member_id: UUID,
  content: string,
  published: Date,
};

export type Tag = {
  id: UUID,
  name: string,
  name_en?: string,
  color?: string
  is_default: boolean
};

export type EventTag = {
  id: UUID,
  article_id: UUID,
  tag_id: UUID,
};

export type SocialTable = 'event_going' | 'event_interested';

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> &
Partial<Omit<T, O>>;
export type CreateEvent = Create<
Event,
| 'title'
| 'alarm_active'
| 'description'
| 'start_datetime'
| 'end_datetime'
| 'organizer'
| 'author_id'
| 'short_description',
'id'
>;
