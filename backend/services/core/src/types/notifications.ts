// eslint-disable-next-line import/no-cycle
import { UUID } from '../shared';

export type SQLNotification = {
  id: UUID,
  title: string,
  message: string,
  type: string,
  link: string,
  readAt?: Date,
  member_id: UUID,
  created_at: Date,
  updated_at: Date,
};
