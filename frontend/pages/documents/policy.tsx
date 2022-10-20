import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Browser from '~/components/FileBrowser';

export default function DocumentPage() {
  return (
    <>
      <h2>Policy</h2>
      <Browser bucket="files" prefix="public/policy" />
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
