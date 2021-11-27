import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import CommitteesList from '~/components/Committees/List';

export default function Committees() {
  return <CommitteesList />;
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'committees'])),
    },
  };
}
