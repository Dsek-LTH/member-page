import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';
import NollaLayout, { useNavItems } from '../../components/Nolla/layout';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';

export const getStaticProps = genGetProps(['nolla']);

function Hero() {
  const translate = useNollaTranslate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        position: 'relative',
        gap: 5,
        mb: 5,
      }}
    >
      <Box sx={{ maxWidth: '60ch' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
          }}
        >
          {translate('index.hero.title')}
        </Typography>
        <Typography variant="body1">
          {translate('index.hero.text')}
        </Typography>
      </Box>
      <Image
        src="/images/nolla/diverse.png"
        alt="Glada d-sekare"
        width={1424}
        height={399}
        layout="intrinsic"
        objectFit="cover"
        style={{ borderRadius: '15px' }}
      />
    </Box>
  );
}

function CardGrid() {
  const router = useRouter();
  const navItems = useNavItems();

  return (
    <Box
      sx={{
        display: 'grid',
        position: 'relative',
        rowGap: 4,
        columnGap: 5,
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gridAutoRows: 'minmax(auto, 1fr)',
      }}
    >
      {navItems.slice(1).map((card) => (
        <Button
          sx={(t) => ({
            zIndex: 1,
            color: 'white',
            // background: 'linear-gradient(90deg, #AA28A7 0%, #DC2A8A 100%)',
            background: 'radial-gradient(#DC2A8A 0%, #AA28A7 100%)',
            borderRadius: '15px',
            '&:hover': {
              filter: 'brightness(1.1)',
              boxShadow: '5px 5px 20px hsla(317, 82%, 56%, 0.25)',
              transform: 'translate(-5px, -5px)',
              outline: '1px solid white',
            },
            transition: t.transitions.create([
              'filter',
              'outline',
              'box-shadow',
              'transform',
            ]),
          })}
          key={card.route}
          onClick={() => router.push(card.route)}
        >
          <Typography sx={{ py: 3, fontFamily: 'Montserrat', fontWeight: 700 }}>
            {card.desc || card.title}
          </Typography>
        </Button>
      ))}
      <Image
        src="/images/nolla/d_logo_new.png"
        layout="fill"
        alt="D-sek logo"
        objectFit="contain"
        style={{ zIndex: -1, opacity: 0.1 }}
      />
    </Box>
  );
}

function Letter() {
  const translate = useNollaTranslate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        mx: 2,
        my: 5,
        gap: 5,
        '& img': {
          maxHeight: { xs: '400px', sm: 'initial' },
        },
      }}
    >
      <Image
        src="/images/styrelsen/ordforande.jpg"
        alt="Sofia Tatidis"
        width={4000}
        height={6000}
        layout="intrinsic"
        objectFit="cover"
        style={{ borderRadius: '15px' }}
      />
      <Box>
        <Typography variant="h5">
          {translate('index.letter.title')}
        </Typography>
        <br />
        <Typography variant="body1">
          {translate('index.letter.text')}
        </Typography>
      </Box>
    </Box>
  );
}

function LandingPage() {
  return (
    <>
      <Hero />
      <CardGrid />
      <Letter />
    </>
  );
}

LandingPage.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

LandingPage.theme = theme;

export default LandingPage;
