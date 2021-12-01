import { Typography, Container, Link } from '@material-ui/core';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Error() {
  const { t } = useTranslation('common');
  return (
    <Container maxWidth="md">
      <Stack
        spacing={4}
        direction="column"
        height="100%"
        alignItems="center"
        alignContent="center"
      >
        <Typography variant="h1">404</Typography>
        <Typography variant="subtitle1" component="p">
          Oops... du försökte komma åt en sida som inte finns! Om du klickade du
          på en länk är vi tacksamma ifall du kontaktar{' '}
          <Link
            color="inherit"
            underline="always"
            component="a"
            href="mailto:dwww@dsek.se?subject=Broken link"
          >
            dwww@dsek.se
          </Link>{' '}
          så vi kan fixa den.
        </Typography>
      </Stack>
    </Container>
  );
}
