import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import Documents from '~/components/Documents';

export default function DocumentPage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('meetingDocuments')}</h2>
      <Documents />
    </>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
