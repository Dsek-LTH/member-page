import * as sql from '../types/database';
import * as gql from '../types/graphql';

export function convertMandate(mandate: sql.Mandate): gql.Mandate {
  const {
    position_id, member_id, start_date, end_date, ...rest
  } = mandate;

  const toDate = (d: Date) => `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}-${(`0${d.getDate()}`).slice(-2)}`;

  const m: gql.Mandate = {
    position: { id: position_id },
    member: { id: member_id },
    start_date: toDate(start_date),
    end_date: toDate(end_date),
    ...rest,
  };

  return m;
}

export const convertPosition = (position: sql.Position, activeMandates: sql.Mandate[]):
  gql.Position => {
  const {
    committee_id, name_en, board_member, email, ...rest
  } = position;
  let p: gql.Position = {
    boardMember: board_member,
    email: email ?? undefined,
    activeMandates: activeMandates.map((mandate) => convertMandate(mandate)),
    ...rest,
  };
  if (committee_id) {
    p = {
      committee: { id: committee_id },
      ...p,
    };
  }
  if (name_en) {
    p = {
      nameEn: name_en,
      ...p,
    };
  }
  return p;
};

export function todayInInterval(start: Date, end: Date): boolean {
  const today = new Date();
  return today >= start && today <= end;
}
