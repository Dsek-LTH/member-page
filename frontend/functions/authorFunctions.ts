import {
  Author, Mandate, MeHeaderQuery, Member,
} from '~/generated/graphql';
import { getFullName } from './memberFunctions';

// eslint-disable-next-line import/prefer-default-export
export const getSignature = (author: Partial<Author>): string => {
  if (author.__typename === 'Member') {
    return getFullName(author as Member);
  }
  const mandate = (author as Mandate);
  return `${getFullName(mandate.member)}, ${mandate.position.name}`;
};

export const getAuthorId = (author: Partial<Author>): string => {
  if (author.__typename === 'Member') {
    const member = author as Member;
    return member.id;
  }
  const mandate = author as Mandate;
  return mandate.member.id;
};

export const authorIsUser = (author: any, user: MeHeaderQuery['me']) => getAuthorId(author) === user.id;
