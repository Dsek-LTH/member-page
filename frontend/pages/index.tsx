import React from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack, Typography } from '@mui/material';
import Image from 'next/image';

function HomePage() {
  return (
    <Stack>
      <Stack sx={{
        position: 'absolute', left: 0, zIndex: 0, marginTop: '1rem',
      }}
      >
        <img src="/images/hero-image.jpg" />
      </Stack>
      <Typography
        variant="h1"
        sx={{
          color: 'white',
          zIndex: 1,
          marginTop: '10rem',
          maxWidth: '35rem',
        }}
        fontWeight="bold"
      >
        Det
        {' '}
        <Typography fontWeight="bold" variant="h1" component="span" color="primary">roliga</Typography>
        {' '}
        med plugget
      </Typography>
    </Stack>
  );
}
export default HomePage;

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'calendar', 'news'])),
    },
  };
}
