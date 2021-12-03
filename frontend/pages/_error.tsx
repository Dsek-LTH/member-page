import { Typography, Container, Link } from '@material-ui/core';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import NoTitleLayout from '~/components/NoTitleLayout';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'error'])),
    },
  };
}

export default function Error() {
  const { t } = useTranslation('error');
  return (
    <NoTitleLayout>
      <Container maxWidth="md">
        <Stack
          spacing={4}
          direction="column"
          height="100%"
          alignItems="center"
          alignContent="center"
        >
          <Typography variant="h2" component="h1">
            {t('pageError')}
          </Typography>
          <HeartBrokenIcon
            color="error"
            style={{ width: 105, height: 105 }}
            fontSize="large"
          />
          <Typography variant="subtitle1" component="p">
            {t('serverError1')}
          </Typography>
          <Typography style={{ marginTop: '1rem' }}>
            {t('pleaseContact')}{' '}
            <Link
              color="inherit"
              underline="always"
              component="a"
              href={`mailto:dwww@dsek.se?subject=${t('subjectError')}`}
            >
              dwww@dsek.se
            </Link>{' '}
            {t('serverError2')}
          </Typography>
        </Stack>
      </Container>
    </NoTitleLayout>
  );
}
