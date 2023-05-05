import GavelIcon from '@mui/icons-material/Gavel';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Documents from '~/components/Documents';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';
import routes from '~/routes';

export default function DocumentPage() {
  const { t } = useTranslation();
  useSetPageName(t('meetingDocuments'));
  return (
    <>
      <h2>{t('meetingDocuments')}</h2>
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
      </Stack>
      <Documents />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
