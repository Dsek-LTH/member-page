import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import MasonryCard from '~/components/Nolla/Card';
import ProfileCard from '~/components/Nolla/ProfileCard';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';
import genGetProps from '~/functions/genGetServerSideProps';

function Row({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        flexWrap: 'wrap',
        gap: 4,
      }}
    >
      {children}
    </Box>
  );
}

function Staben() {
  const translate = useNollaTranslate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box sx={{ maxWidth: '65ch', margin: 'auto' }}>
        <MasonryCard>
          <Typography variant="h4">{translate('staben.title')}</Typography>
          <Typography variant="body1">{translate('staben.text')}</Typography>
        </MasonryCard>
      </Box>

      <Box sx={{ position: 'relative', height: 600 }}>
        <Image src="/images/staben/staben.png" alt="staben" layout="fill" objectFit="contain" />
      </Box>

      <Row>
        <ProfileCard
          name={(
            <>
              <div>Øverphøs</div>
              <div>Zira Ca||isto</div>
            </>
          )}
          desc={translate('staben.zira')}
          image="/images/staben/zira.png"
        />
        <ProfileCard
          name="HyperI/On eClipse"
          desc={translate('staben.hyperion')}
          image="/images/staben/hyperion.png"
        />
        <ProfileCard
          name="Noctus AeterNUM"
          desc={translate('staben.noctus')}
          image="/images/staben/noctus.png"
        />
        <ProfileCard
          name="AlUXio Ray"
          desc={translate('staben.aluxio')}
          image="/images/staben/aluxio.png"
        />
        <ProfileCard
          name="Adrastea VolatiliON"
          desc={translate('staben.adrastea')}
          image="/images/staben/adrastea.png"
        />
        <ProfileCard
          name="DeimOS Valo"
          desc={translate('staben.deimos')}
          image="/images/staben/deimos.png"
        />
      </Row>
    </Box>
  );
}

export const getStaticProps = genGetProps(['nolla']);

Staben.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

Staben.theme = theme;

export default Staben;
