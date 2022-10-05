import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import Browser from '~/components/FileBrowser';
import Link from '~/components/Link';

export default function DocumentPage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('meetingDocuments')}</h2>
      <div style={{ margin: '1rem 0' }}>

        <Link href="/documents">Tillbaka till dokument</Link>
      </div>
      <Browser bucket="documents" />
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
