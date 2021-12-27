import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FileBrowser from '~/components/FileBrowser';

export default function DocumentPage() {
  return <FileBrowser bucket="documents" />;
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
