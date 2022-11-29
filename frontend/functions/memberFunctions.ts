import { MeHeaderQuery, Member, MemberPageQueryResult } from '~/generated/graphql';

export const getFullName = (member: Member | MeHeaderQuery['me'] | MemberPageQueryResult['data']['member'], useNickname = true, full = false) => {
  const name = `${member.first_name} ${member.nickname && useNickname ? `"${member.nickname}" ` : ''}${member.last_name}`;
  if (full) return name;
  return name.substring(0, 50);
};

export const getClassYear = (member: Member | MemberPageQueryResult['data']['member']) => `${member.class_programme}${member.class_year % 100}`;
