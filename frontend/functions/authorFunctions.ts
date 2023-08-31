import { i18n } from 'next-i18next';
import selectTranslation from '~/functions/selectTranslation';
import
{
  ArticleQuery,
  MeHeaderQuery, Member,
} from '~/generated/graphql';
import { getFullName } from './memberFunctions';

export const getMemberSignature = (member: Member): string => getFullName(member);
// eslint-disable-next-line import/prefer-default-export
export const getSignature = (author: ArticleQuery['article']['author']): string => {
  if (author.type === 'Custom' && author.customAuthor) {
    return selectTranslation(i18n, author.customAuthor.name, author.customAuthor.nameEn);
  }
  if (author.type === 'Mandate' && author.mandate && author.mandate.position?.name) {
    return `${getFullName(author.member)}, ${author.mandate.position.name}`;
  }
  return getMemberSignature(author.member);
};

export const getAuthorImage = (author: ArticleQuery['article']['author']): string | undefined => {
  if (author.type === 'Custom') {
    if (!author.customAuthor.imageUrl) return undefined;
    return author.customAuthor.imageUrl;
  }
  return author.member?.picture_path || '';
};

export const authorIsUser = (author: ArticleQuery['article']['author'], user: MeHeaderQuery['me']) => {
  if (!user) return false;
  if (author?.member?.id === user?.id) return true;
  if (author.customAuthor !== undefined
    && user.customAuthorOptions?.some((option) => option.id === author.customAuthor?.id)) {
    return true;
  }
  return false;
};
