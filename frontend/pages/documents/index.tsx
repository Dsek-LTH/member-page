import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FileBrowser from '~/components/FileBrowser';

const BUCKET_NAME = 'documents';

export default function DocumentPage() {
  return <FileBrowser bucket={BUCKET_NAME} />;
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
