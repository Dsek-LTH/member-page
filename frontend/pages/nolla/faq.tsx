import { Box, Typography } from '@mui/material';
import React from 'react';
import MasonryCard from '~/components/Nolla/Card';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';
import genGetProps from '~/functions/genGetServerSideProps';

function FAQ() {
  const translate = useNollaTranslate();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))', gap: [2, 4, 8] }}>
      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          {translate('faq.mentor.title')}
        </Typography>
        <Typography variant="body1">
          {translate('faq.mentor.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          {translate('faq.pepper.title')}
        </Typography>
        <Typography variant="body1">
          {translate('faq.pepper.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          {translate('faq.when.title')}
        </Typography>
        <Typography variant="body1">
          {translate('faq.when.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          {translate('faq.duration.title')}
        </Typography>
        <Typography variant="body1">
          {translate('faq.duration.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          {translate('faq.bring.title')}
        </Typography>
        <Typography variant="body1">
          {translate('faq.bring.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          {translate('faq.participate.title')}
        </Typography>
        <Typography variant="body1">
          {translate('faq.participate.text')}
        </Typography>
      </MasonryCard>
    </Box>
  );
}

export const getStaticProps = genGetProps(['nolla']);

FAQ.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

FAQ.theme = theme;

export default FAQ;
