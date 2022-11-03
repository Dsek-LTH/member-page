import { MeHeaderQuery, Member, MemberPageQueryResult } from '~/generated/graphql';

export const getFullName = (member: Member | MeHeaderQuery['me'] | MemberPageQueryResult['data']['member'], useNickname = true) =>
  `${member.first_name} ${member.nickname && useNickname ? `"${member.nickname}" ` : ''}${member.last_name}`;

export const getClassYear = (member: Member | MemberPageQueryResult['data']['member']) => `${member.class_programme}${member.class_year % 100}`;
