import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import DefaultLayout from '~/layouts/defaultLayout';
import FileBrowser from '~/components/FileBrowser';

export default function DocumentPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <DefaultLayout>
        <FileBrowser/>
      </DefaultLayout>
    </>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  }
})