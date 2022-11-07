import type { TFunction } from 'next-i18next';
import { getFullName } from '~/functions/memberFunctions';
import { ArticleQuery } from '~/generated/graphql';

export default function getLikers(
  likers: ArticleQuery['article']['likers'],
  t: TFunction,
) {
  if (!likers || likers.length === 0) return null;

  if (likers.length === 1) {
    return (
      <>
        {' '}
        {getFullName(likers[0])}
        {' '}
        {t('likes_this')}
      </>
    );
  }

  if (likers.length === 2) {
    return (
      <>
        {getFullName(likers[0])}
        {t('and')}
        {getFullName(likers[1])}
        {' '}
        {t('like_this')}
      </>
    );
  }

  if (likers.length === 3) {
    return (
      <>
        {getFullName(likers[0])}
        {', '}
        {getFullName(likers[1])}
        {t('and')}
        {getFullName(likers[2])}
        {' '}
        {t('like_this')}
      </>
    );
  }
  // likers.length > 3
  return (
    <>
      {getFullName(likers[0])}
      {', '}
      {getFullName(likers[1])}
      {t('and')}
      {likers.length - 2}
      {' '}
      {t('others')}
      {' '}
      {t('like_this')}
    </>
  );
}
