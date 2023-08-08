import { Box, Typography } from '@mui/material';
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

function Pepparna() {
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
          <Typography variant="h4">{translate('pepparna.title')}</Typography>
          <Typography variant="body1">
            {translate('pepparna.text')}
          </Typography>
        </MasonryCard>
      </Box>

      <Row>
        <ProfileCard
          name="Emma"
          desc={translate('pepparna.emma')}
          image="/images/pepparna/emma.jpg"
        />
        <ProfileCard
          name="Linnea"
          desc={translate('pepparna.linnea')}
          image="/images/pepparna/linnea.jpg"
        />
      </Row>

      <Row>
        <ProfileCard
          name="Loke"
          desc={translate('pepparna.loke')}
          image="/images/pepparna/loke.jpg"
        />
        <ProfileCard
          name="Alicia"
          desc={translate('pepparna.alicia')}
          image="/images/pepparna/alicia.jpg"
        />
        <ProfileCard
          name="Rilde"
          desc={translate('pepparna.rilde')}
          image="/images/pepparna/rilde.jpg"
        />
        <ProfileCard
          name="Thilda"
          desc={translate('pepparna.thilda')}
          image="/images/pepparna/thilda.jpg"
        />
        <ProfileCard
          name="Axel"
          desc={translate('pepparna.axel')}
          image="/images/pepparna/axel.jpg"
        />
        <ProfileCard
          name="Stina"
          desc={translate('pepparna.stina')}
          image="/images/pepparna/stina.jpg"
        />
        <ProfileCard
          name="Sebastian"
          desc={translate('pepparna.sebastian')}
          image="/images/pepparna/sebastian.jpg"
        />
        <ProfileCard
          name="Nora"
          desc={translate('pepparna.nora')}
          image="/images/pepparna/nora.jpg"
        />
        <ProfileCard
          name="Felix"
          desc={translate('pepparna.felix')}
          image="/images/pepparna/felix.jpg"
        />
      </Row>
    </Box>
  );
}

export const getStaticProps = genGetProps(['nolla']);

Pepparna.getLayout = function getLayout({ children }) {
  return <NollaLayout maxWidth="lg">{children}</NollaLayout>;
};

Pepparna.theme = theme;

export default Pepparna;
