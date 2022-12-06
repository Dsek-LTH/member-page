import React from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack } from '@mui/material';
import Cover from '~/components/Home/Cover';
import Widgets from '~/components/Home/Widgets';

function HomePage() {
  return (
    <Stack>
      <Cover />
      <Widgets />
    </Stack>
  );
}

export default HomePage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'calendar', 'news'])),
    },
  };
}
