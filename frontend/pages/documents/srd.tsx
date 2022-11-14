import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Browser from '~/components/FileBrowser';

export default function DocumentPage() {
  return (
    <>
      <h2>SRD</h2>
      <Browser bucket="files" prefix="public/srd" />
    </>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
