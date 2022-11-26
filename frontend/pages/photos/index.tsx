import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Browser from '~/components/FileBrowser';

export default function DocumentPage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('photos')}</h2>
      <Browser bucket="photos" prefix="public/events" />
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
