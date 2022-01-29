import { Member, MemberPageQueryResult } from '~/generated/graphql';

export const getFullName = (member: Member | MemberPageQueryResult['data']['memberById'], useNickname = true) =>
  `${member.first_name} ${member.nickname && useNickname ? `"${member.nickname}"` : ''} ${member.last_name}`;

export const getClassYear = (member: Member | MemberPageQueryResult['data']['memberById']) => `${member.class_programme}${member.class_year % 100}`;
