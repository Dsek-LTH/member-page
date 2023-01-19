// eslint-disable-next-line import/no-cycle
import { UUID } from '../shared';

export type SQLNotification = {
  id: UUID,
  title: string,
  message: string,
  type: string,
  link: string,
  read_at?: Date,
  member_id: UUID,
  created_at: Date,
  updated_at: Date,
};

export type Token = {
  id: UUID;
  member_id?: UUID;
  expo_token: string;
};

export type TagSubscription = {
  id: UUID,
  member_id: UUID,
  tag_id: UUID,
};
