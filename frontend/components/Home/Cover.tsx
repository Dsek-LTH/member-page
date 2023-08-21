/* eslint-disable @next/next/no-img-element */
import {
  Stack, Typography, Button, Box,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from '../Link';

export default function Cover() {
  const { t } = useTranslation(['homePage']);

  return (
    <Stack
      sx={{
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          gap: 1,
        }}
      >
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
          <Box component="span" sx={{ color: 'primary.main' }}>
            {t('homePage:fun')}
          </Box>
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
          <Link href="/nolla">
            <Button
              sx={(theme) => ({
                animation: 'pulse 1s infinite cubic-bezier(0.66, 0, 0, 1)',
                boxShadow: `0 0 0 0 ${theme.palette.primary.main}`,
                '@keyframes pulse': {
                  to: {
                    boxShadow: '0 0 0 10px transparent',
                  },
                },
              })}
              variant="contained"
            >
              {t('homePage:nollning')}
            </Button>
          </Link>
          <Link href="/info/for-foretag">
            <Button variant="outlined">{t('homePage:for_companies')}</Button>
          </Link>
        </Stack>
      </Box>
    </Stack>
  );
}
