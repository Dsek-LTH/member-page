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
  if (mandate.position?.id?.startsWith('dsek.noll.stab')) {
    return 'Staben';
  }

  return `${getFullName(mandate.member)}, ${mandate.position.name}`;
};

export const getAuthor = (author: Partial<Author>): Partial<Member> => {
  if (author.__typename === 'Member') {
    const member = author as Member;
    return member;
  }
  const mandate = author as Mandate;
  return mandate.member;
};

export const getAuthorId = (author: Partial<Author>): string => getAuthor(author).id;
export const getAuthorStudentId = (author: Partial<Author>): string => getAuthor(author).student_id;

export const authorIsUser = (author: any, user: MeHeaderQuery['me']) => author && user && getAuthorId(author) === user.id;
