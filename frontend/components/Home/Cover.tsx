/* eslint-disable @next/next/no-img-element */
import { Stack, Typography, Button } from '@mui/material';

export default function Cover() {
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
          Det
          {' '}
          <Typography
            fontSize={{ xs: '2rem', md: '6rem' }}
            fontWeight="bold"
            variant="h1"
            component="span"
            color="primary"
          >
            roliga

          </Typography>
          {' '}
          med plugget
        </Typography>
        <Typography
          component="h1"
          variant="h1"
          color="primary"
          fontSize={{ xs: '1.5rem', md: '2rem' }}
          fontWeight="bold"
        >
          D-sektionen inom TLTH
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            sx={{ width: 'fit-content' }}
            variant="outlined"
            href="http://nolla.nu"
            rel="noopener noreferrer"
            target="_blank"
          >
            Blivande student ?
          </Button>
          <Button
            sx={{ width: 'fit-content' }}
            variant="outlined"
            href="https://www.dsek.se/sektionen/indm/for_foretag/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Företag ?
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
