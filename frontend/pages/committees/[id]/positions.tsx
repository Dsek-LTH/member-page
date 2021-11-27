import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import Positions from '~/components/Positions';
import { useRouter } from 'next/router';

export default function MandatePageByYear() {
  const router = useRouter();
  const { id: idString } = router.query;
  const id = Number(idString);
  return <Positions id={id} />;
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'committee'])),
    },
  };
}
