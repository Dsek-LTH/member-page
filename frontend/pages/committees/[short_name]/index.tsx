import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useRouter } from 'next/router';
import Positions from '~/components/Positions';

export default function CommitteePage() {
  const router = useRouter();
  const { short_name: shortName } = router.query;
  return <Positions shortName={shortName.toString()} />;
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'committee'])),
    },
  };
}
