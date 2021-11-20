import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import DefaultLayout from '~/layouts/defaultLayout';
import FileBrowser from '~/components/FileBrowser';
import putFile from '~/functions/putFile';

const BUCKET_NAME = 'news';

export default function DocumentPage() {


  return (
    <>
      <DefaultLayout>
        <FileBrowser
          bucket={BUCKET_NAME}
        />
      </DefaultLayout>
    </>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'fileBrowser']),
  }
})