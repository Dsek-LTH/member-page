import { useTranslation } from 'next-i18next';
import get from 'lodash/get';
import sv from './locales/sv';
import en from './locales/en';

export default function useNollaTranslate() {
  const { i18n } = useTranslation();

  const messages = {
    sv,
    en,
  };

  return (key: string) => get(messages[i18n.language], key);
}
