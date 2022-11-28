import { TFunction } from 'next-i18next';

export default function createPageTitle(t: TFunction, translationKey: string) {
  return `${t(translationKey)} - ${t('common:siteName')}`;
}
