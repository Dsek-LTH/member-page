import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import CommitteesList from '~/components/Committees/CommitteesList';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function Committees() {
  return (
    <NoTitleLayout>
      <CommitteesList />
    </NoTitleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'committee'])),
    },
  };
}
