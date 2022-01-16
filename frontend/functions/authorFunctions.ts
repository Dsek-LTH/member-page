import { Author, Mandate, Member } from '~/generated/graphql';
import { getFullName } from './memberFunctions';

// eslint-disable-next-line import/prefer-default-export
export const getSignature = (author: Partial<Author>): string => {
  if (author.__typename === 'Member') {
    return getFullName(author as Member);
  }
  const mandate = (author as Mandate);
  return `${getFullName(mandate.member)}, ${mandate.position.name}`;
};
