import { Member } from '~/generated/graphql';

export const getFullName = (member: Member, useNickname = true) =>
  `${member.first_name} ${member.nickname && useNickname ? `"${member.nickname}"` : ''} ${member.last_name}`;

export const getFullNameGenitive = (member: Member, language: string, useNickname = true) => {
  const name = getFullName(member, useNickname);
  if (name[name.length - 1] === 's') {
    return (language === 'en') ? `${name}'` : name;
  }
  return (language === 'en') ? `${name}'s` : `${name}s`;
};

export const getClassYear = (member: Member) => `${member.class_programme}${member.class_year % 100}`;
