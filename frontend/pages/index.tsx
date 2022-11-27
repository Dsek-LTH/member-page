import React from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack, Typography, Button } from '@mui/material';
import Link from 'components/Link';
import DsekIcon from '~/components/Icons/DsekIcon';

function ProgramInfo({ name }) {
  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <DsekIcon />
      <Stack>
        {name}
        <Button>
          LÄS MER
        </Button>
      </Stack>
    </Stack>
  );
}

function HomePage() {
  return (
    <Stack>
      <Stack sx={{
        height: '100vh',
      }}
      >
        <img
          src="/images/hero-image.jpg"
          alt=""
          style={{
            position: 'absolute',
            objectFit: 'cover',
            width: '100%',
            height: '100vh',
            left: '0',
          }}
        />
        <Typography
          variant="h1"
          sx={{
            position: 'absolute',
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
      <Stack sx={{
        marginTop: '4rem',
      }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            textAlign: 'center',
          }}
          fontWeight="bold"
        >
          Välkommen till
          <Typography fontWeight="bold" variant="h2" component="span" color="primary"> D-sektionen </Typography>
          vid TLTH!
        </Typography>
        <Stack sx={{
          width: '60%',
          margin: 'auto',
          marginTop: '1rem',
          gap: '1rem',
        }}
        >
          <Typography
            color="primary"
            fontWeight="bold"
          >
            Vilka är vi?
          </Typography>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna
            aliquabore et dolore magna aliqua. Lorem ipsum dolor sit amet
            , consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </Typography>
          <Typography
            color="primary"
            fontWeight="bold"
          >
            Vad gör vi?
          </Typography>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna
            aliquabore et dolore magna aliqua. Lorem ipsum dolor sit amet
            , consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </Typography>
          <Typography>
            Läs mer om oss
            {' '}
            <Link
              href="/"
              newTab
              style={{
                color: 'primary',
              }}
            >
              HÄR!
            </Link>
          </Typography>
          <Typography
            color="primary"
            fontWeight="bold"
            variant="h3"
            sx={{
              textAlign: 'center',
            }}
          >
            Våra program
          </Typography>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <ProgramInfo
              name="Datateknik"
            />
          </Stack>
        </Stack>
      </Stack>
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
