import * as sql from '../../types/database';
import * as gql from '../../types/graphql';
import { Event, Tag } from '../../types/events';
import { SQLNotification } from '../../types/notifications';

export function convertMandate(mandate: sql.Mandate): gql.Mandate {
  const {
    position_id: positionId,
    member_id: memberId,
    start_date: startDate,
    end_date: endDate,
    ...rest
  } = mandate;

  const toDate = (d: Date) => `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}-${(`0${d.getDate()}`).slice(-2)}`;

  const m: gql.Mandate = {
    position: { id: positionId },
    member: { id: memberId },
    start_date: toDate(startDate),
    end_date: toDate(endDate),
    ...rest,
  };

  return m;
}

export const convertPosition = (
  position: sql.Position,
  activeMandates: sql.Mandate[],
):
gql.Position => {
  const {
    committee_id: committeeId,
    name_en: nameEn,
    description,
    description_en: descriptionEn,
    board_member: boardMember,
    email,
    ...rest
  } = position || {};
  let p: gql.Position = {
    boardMember,
    description: description ?? undefined,
    descriptionEn: descriptionEn ?? undefined,
    nameEn: nameEn ?? undefined,
    activeMandates: activeMandates.map((mandate) => convertMandate(mandate)),
    email: email ?? undefined,
    ...rest,
  };
  if (committeeId) {
    p = {
      committee: { id: committeeId, shortName: '' },
      ...p,
    };
  }
  return p;
};

export function todayInInterval(start: Date, end: Date, year?: number): boolean {
  const today = new Date();
  if (year !== undefined) {
    today.setFullYear(year);
  }
  return today >= start && today <= end;
}

export function populateMandates(
  mandates: gql.Mandate[],
  members: sql.Member[],
  positions: sql.Position[],
): gql.FastMandate[] {
  return mandates
    .map((data) => ({
      ...data,
      member: members.find((m) => m.id === data.member?.id)!,
      position: convertPosition(positions.find((p) => p.id === data.position?.id)!, []),
      __typename: 'FastMandate',
    }));
}

export function convertEvent(
  {
    event,
    peopleGoing = [],
    iAmGoing,
    peopleInterested = [],
    iAmInterested,
  }:
  {
    event: Event,
    peopleGoing?: gql.Member[],
    iAmGoing?: boolean,
    peopleInterested?: gql.Member[],
    iAmInterested?: boolean,
  },
): gql.Event {
  const { author_id: authorId, alarm_active: larmActive, tags, ...rest } = event;
  
  const convertedEvent = {
    author: {
      id: authorId,
    },
    ...rest,
    peopleGoing,
    iAmGoing: iAmGoing || false,
    peopleInterested,
    iAmInterested: iAmInterested || false,
    comments: [],
    alarm_active: larmActive || false,
    tags: []
  };
  return convertedEvent;
}

export function convertNotification(
  notification: SQLNotification,
): gql.Notification {
  return (
    {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      createdAt: notification.created_at,
      updatedAt: notification.updated_at,
      type: notification.type,
      readAt: notification.read_at,
    }
  );
}
