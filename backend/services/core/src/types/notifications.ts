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
  // The member which took the action that initiated the notification. Null if not relevant.
  from_author_id?: UUID,
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

// Settings for which notifications a user wants to receive
// as well as if they should receive push notifications for it
export type SubscriptionSetting = {
  id: UUID,
  member_id: UUID,
  type: string, // For example: LIKE, COMMENT, EVENT_GOING etc.
  push_notification: boolean,
};
