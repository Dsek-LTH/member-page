import GavelIcon from '@mui/icons-material/Gavel';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Guidelines from '~/components/GoverningDocuments/Guidelines';
import Policies from '~/components/GoverningDocuments/Policies';
import genGetProps from '~/functions/genGetServerSideProps';
import routes from '~/routes';

export default function GoverningDocumentsPage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('governing_documents')}</h2>
      <Stack spacing={2}>
        <Button
          sx={{ width: 'fit-content' }}
          variant="contained"
          target="_blank"
          rel="noopener noreferrer"
          href={routes.statutes}
          download
        >
          <GavelIcon style={{ marginRight: '0.5rem' }} />
          {t('statutes')}
        </Button>
        <Button
          sx={{ width: 'fit-content' }}
          variant="contained"
          target="_blank"
          rel="noopener noreferrer"
          href={routes.regulations}
          download
        >
          <GavelIcon style={{ marginRight: '0.5rem' }} />
          {t('regulations')}
        </Button>
        <Stack flexDirection={{ xs: 'column', sm: 'row' }}>
          <Policies />
          <div style={{ marginTop: '1rem', marginRight: '2rem' }} />
          <Guidelines />
        </Stack>
      </Stack>
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
