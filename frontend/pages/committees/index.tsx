import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import CommitteesList from '~/components/Committees/CommitteesList';
import createPageTitle from '~/functions/createPageTitle';

export default function Committees() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('guild')}</h2>
      <Head>
        <title>{createPageTitle(t, 'guild')}</title>
      </Head>
      <CommitteesList />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'committee'])),
    },
  };
}
