import { Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import DocumentButton from '~/components/GoverningDocuments/DocumentButton';
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
        <DocumentButton
          title={t('statutes')}
          url={routes.statutes}
          icon="gavel"
        />
        <DocumentButton
          title={t('regulations')}
          url={routes.regulations}
          icon="gavel"
        />
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
