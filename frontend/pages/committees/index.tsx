import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CommitteesList from '~/components/Committees/CommitteesList';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function Committees() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('committees')}</h2>
      <CommitteesList />
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'committee'])),
    },
  };
}
