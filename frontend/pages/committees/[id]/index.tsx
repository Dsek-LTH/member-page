import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import Positions from '~/components/Positions';
import { useRouter } from 'next/router';

export default function CommitteePage() {
  const router = useRouter();
  const { id } = router.query;
  return <Positions committeeId={id.toString()} />;
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'committee'])),
    },
  };
}
