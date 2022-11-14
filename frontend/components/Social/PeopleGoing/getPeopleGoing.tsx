import type { TFunction } from 'next-i18next';
import { getFullName } from '~/functions/memberFunctions';
import { EventQuery } from '~/generated/graphql';

export default function getPeopleGoing(
  peopleGoing: EventQuery['event']['peopleGoing'],
  t: TFunction,
) {
  if (!peopleGoing || peopleGoing.length === 0) return null;

  if (peopleGoing.length === 1) {
    return (
      <>
        {' '}
        {getFullName(peopleGoing[0])}
        {' '}
        {t('is_going')}
      </>
    );
  }

  if (peopleGoing.length === 2) {
    return (
      <>
        {getFullName(peopleGoing[0])}
        {t('and')}
        {getFullName(peopleGoing[1])}
        {' '}
        {t('are_going')}
      </>
    );
  }

  if (peopleGoing.length === 3) {
    return (
      <>
        {getFullName(peopleGoing[0])}
        {', '}
        {getFullName(peopleGoing[1])}
        {t('and')}
        {getFullName(peopleGoing[2])}
        {' '}
        {t('are_going')}
      </>
    );
  }
  // likers.length > 3
  return (
    <>
      {getFullName(peopleGoing[0])}
      {', '}
      {getFullName(peopleGoing[1])}
      {t('and')}
      {peopleGoing.length - 2}
      {' '}
      {t('others')}
      {' '}
      {t('are_going')}
    </>
  );
}
