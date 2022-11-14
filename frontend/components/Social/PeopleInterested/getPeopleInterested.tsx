import type { TFunction } from 'next-i18next';
import { getFullName } from '~/functions/memberFunctions';
import { EventQuery } from '~/generated/graphql';

export default function getPeopleInterested(
  peopleInterested: EventQuery['event']['peopleInterested'],
  t: TFunction,
) {
  if (!peopleInterested || peopleInterested.length === 0) return null;

  if (peopleInterested.length === 1) {
    return (
      <>
        {' '}
        {getFullName(peopleInterested[0])}
        {' '}
        {t('is_interested')}
      </>
    );
  }

  if (peopleInterested.length === 2) {
    return (
      <>
        {getFullName(peopleInterested[0])}
        {t('and')}
        {getFullName(peopleInterested[1])}
        {' '}
        {t('are_interested')}
      </>
    );
  }

  if (peopleInterested.length === 3) {
    return (
      <>
        {getFullName(peopleInterested[0])}
        {', '}
        {getFullName(peopleInterested[1])}
        {t('and')}
        {getFullName(peopleInterested[2])}
        {' '}
        {t('are_interested')}
      </>
    );
  }
  // likers.length > 3
  return (
    <>
      {getFullName(peopleInterested[0])}
      {', '}
      {getFullName(peopleInterested[1])}
      {t('and')}
      {peopleInterested.length - 2}
      {' '}
      {t('others')}
      {' '}
      {t('are_interested')}
    </>
  );
}
