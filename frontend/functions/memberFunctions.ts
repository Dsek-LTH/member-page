import { Member } from '~/generated/graphql';

export const getFullName = (member: Member, useNickname = true) => 
  `${member.first_name} ${member.nickname && useNickname ? `"${member.nickname}"` : ''} ${member.last_name}`;

export const getClassYear = (member: Member) => `${member.class_programme}${member.class_year % 100}`;