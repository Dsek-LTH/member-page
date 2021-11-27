import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import FileBrowser from '~/components/FileBrowser';
import putFile from '~/functions/putFile';

const BUCKET_NAME = 'documents';

export default function DocumentPage() {
  return <FileBrowser bucket={BUCKET_NAME} />;
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'fileBrowser'])),
  },
});
