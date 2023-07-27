import { Masonry } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';
import NollaLayout from '../../components/Nolla/layout';

function Nollningen() {
  return (
  // <Box sx={{
  //   // display: 'grid',
  //   // gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   alignItems: 'flex-start',
  //   gap: 8,
  // }}
  // >
    <Masonry columns={[1, 2]} spacing={8}>
      <Box sx={{ maxWidth: '40ch' }}>
        <Typography variant="h4">Vad är nollningen?</Typography>
        <Typography variant="body1">
          Nollningen är ett namn på de fem första veckorna av er tid här på LTH. Den första av
          dessa utspelar sig innan ordinarie undervisning börjar och det är här som aktiviteterna
          ligger som tätast. På dagarna ges nyttiga introduktionskurser i diverse ämnen och på
          kvällarna finns det roliga fritidsaktiviteter och fester att delta i. De första veckorna
          när man kommer till ett universitet kanske man känner sig ensam, eller så oroar man sig
          över om man kommer träffa några kompisar eller ej. Det är precis detta som nollningen
          finns här för, eftersom det är väldigt många studenter som börjar utan att känna en enda
          person i hela staden. Av tidigare studenters erfarenheter så träffar man ofta några av
          sina närmsta vänner och skapar hela umgängeskretsar under nollningen.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '40ch', position: 'relative' }}>
        <Typography variant="h4">När börjar nollningen?</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Nollningen, och er skolgång, börjar måndagen den 21:a augusti. Den första dagen
          kommer du, tillsammans med de andra nyantagna på sektionen, att få en introduktion till
          skolan, sektionen och nollningen. Du kommer även få träffa din phaddergrupp för första
          gången! Resten av den första veckan kommer att bestå av många roliga och varierade
          aktiviteter som kommer att göra dig bekant med mycket av vad skolan och studentlivet har
          att erbjuda!
        </Typography>
        <Image
          src="/images/nolla/nollningen_when.jpg"
          alt="Glada d-sekare"
          width={1992}
          height={1328}
          layout="intrinsic"
          objectFit="cover"
          style={{ borderRadius: '15px' }}
        />
      </Box>

      <Box sx={{ maxWidth: '40ch', position: 'relative' }}>
        <Typography variant="h4">Vad händer under nollningen?</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Under nollningen kommer du att få delta i en stor mängd varierade event med syfte att
          introducera dig som nyantagen till vad studentlivet både inom LTH och resten av Lund har
          att erbjuda, samt att få en utmärkt chans att träffa dina vänner som du kommer spendera
          din universitetstid med! Dessa event består av allt från storslagna karnevalsliknande
          dagar, sittningar, sportevent, pubar, fester, spelkvällar och mycket mer.
          Nollningsevent sker generellt på eftermiddagen och alltid efter skoldagen är klar,
          detta är för att du som nolla inte ska behöva välja mellan att plugga och vara med på
          nollningen. Du kommer att bli indelad i en phaddergrupp som du kommer spendera
          majoriteten av din tid under nollningen med. Varje phaddergrupp består av ca 8-10
          phaddrar och ca 20 nollor.
        </Typography>
        <Image
          src="/images/nolla/nollningen_what.jpg"
          alt="Glada d-sekare"
          width={2048}
          height={1365}
          layout="intrinsic"
          objectFit="cover"
          style={{ borderRadius: '15px' }}
        />
      </Box>
    </Masonry>
  // </Box>
  );
}

export const getStaticProps = genGetProps(['nolla']);

Nollningen.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

Nollningen.theme = theme;

export default Nollningen;
