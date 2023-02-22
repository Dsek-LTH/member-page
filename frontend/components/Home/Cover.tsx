/* eslint-disable @next/next/no-img-element */
import { Stack, Typography, Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from '../Link';

export default function Cover() {
  const { t } = useTranslation(['homePage']);

  return (
    <Stack sx={{
      height: { xs: '60vh', md: '100vh' },
    }}
    >
      <img
        src="/images/hero-image.jpg"
        alt=""
        style={{
          position: 'absolute',
          objectFit: 'cover',
          width: '100%',
          height: 'inherit',
          left: '0',
          overflow: 'hidden',
        }}
      />
      <Stack sx={{ zIndex: 1 }} spacing={1}>
        <Typography
          variant="h1"
          component="h2"
          fontSize={{ xs: '2rem', md: '6rem' }}
          sx={{
            color: 'white',
            marginTop: { xs: '5rem', md: '10rem' },
            maxWidth: '35rem',
          }}
          fontWeight="bold"
        >
          {t('homePage:header1')}

          {' '}
          <Typography
            fontSize={{ xs: '2rem', md: '6rem' }}
            fontWeight="bold"
            variant="h1"
            component="span"
            color="primary"
          >
            {t('homePage:fun')}

          </Typography>
          {' '}
          {t('homePage:header2')}
        </Typography>
        <Typography
          component="h1"
          variant="h1"
          color="primary"
          fontSize={{ xs: '1.5rem', md: '2rem' }}
          fontWeight="bold"
        >
          {t('homePage:D-Guild_TLTH')}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Link href="/info/for-foretag">
            <Button
              sx={{ width: 'fit-content' }}
              variant="outlined"
            >
              {t('homePage:for_companies')}
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
}
