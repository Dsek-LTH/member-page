import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import genGetProps from '~/functions/genGetServerSideProps';
import NollaLayout, { navItems } from '../../components/Nolla/layout';

export const getStaticProps = genGetProps(['nolla']);

function Hero() {
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
          fontFamily="Montserrat"
        >
          Välkommen till
          {' '}
          <Box sx={{ color: 'hsl(317, 82%, 56%)' }} component="span">
            D‑sektionen!
          </Box>
        </Typography>
        <Typography variant="body1" fontFamily="Montserrat">
          Först och främst, grattis till antagningen och varmt välkommen till
          Lund och D-sektionen! Framför dig har du fem fantastiska år
          bestående av plugg, nya vänner och inte minst ett otroligt
          studentliv. Vi hoppas att du ska stormtrivas!
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
          sx={(theme) => ({
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
            transition: theme.transitions.create([
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
        src="/images/nolla/sofia.jpg"
        alt="Sofia Tatidis"
        width={4000}
        height={6000}
        layout="intrinsic"
        objectFit="cover"
        style={{ borderRadius: '15px' }}
      />
      <Box>
        <Typography variant="h5" fontFamily="Montserrat">
          Välkommen till Lund, LTH och D‑sektionen!
        </Typography>
        <br />
        <Typography variant="body1" fontFamily="Montserrat">
          Att börja plugga på universitet känns nog olika för alla. Vissa har
          precis slutat gymnasiet och är nervösa över att flytta till en
          främmande stad långt hemifrån. Andra har inte suttit i skolbänken på
          flera år och grämer sig inför att sätta sig in i matten igen. Några
          har redan pluggat ett tag och kanske precis bytt till Data eller
          InfoCom och hoppas att utbildningen ska passa bättre än den förra.
        </Typography>
        <br />
        <Typography variant="body1" fontFamily="Montserrat">
          Oavsett vart du kommer från så har säkert du och dina nyblivna
          klasskamrater liknande funderingar. Kommer jag hitta vänner? Är
          utbildningen som jag förväntade mig? Tänk om jag inte klarar mina
          kurser? Tyvärr kan varken jag eller någon annan svara på de frågorna
          åt dig, utan det är en del av utmaningen med att börja en ny
          utbildning. En sak är dock säker, och det är att den kommande tiden
          kommer vara oförglömlig! Du kommer lära dig överkomma utmaningar du
          inte ens föreställde dig existerade och lära känna människor som du
          aldrig annars hade träffat och som kanske är dina bästa vänner även
          om 30 år.
        </Typography>
        <br />
        <Typography variant="body1" fontFamily="Montserrat">
          Under hela din utbildning, och speciellt under n0llningen kommer du
          kunna hitta stöd i D-sektionen. Vi finns till för alla som studerar
          Data och InfoCom och sysslar med allt ifrån studiebevakning,
          brädspelskvällar, LAN, körsång, snickeri, till fester och resor och
          massa massa mer! Passa på att njuta av n0llningen - lär dig av dina
          fantastiska phaddrar och käka all gratis mat du kan. Å hela
          D-sektionens vägnar vill jag ännu en gång välkomna just DIG till
          D-sektionen. Jag önskar dig ett stort lycka till och hoppas vi ses
          ute i vimlet!
        </Typography>
        <br />
        <Typography variant="h6" fontFamily="Montserrat" fontStyle="italic">
          Sofia Tatidis, Ordförande, D‑sektionen
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

export default LandingPage;
