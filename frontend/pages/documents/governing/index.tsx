import { Button, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import DocumentButton from '~/components/GoverningDocuments/DocumentButton';
import Guidelines from '~/components/GoverningDocuments/Guidelines';
import Policies from '~/components/GoverningDocuments/Policies';
import Link from '~/components/Link';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

export default function GoverningDocumentsPage() {
  const { t } = useTranslation();
  const { hasAccess } = useApiAccess();
  return (
    <>
      <PageHeader>{t('governing_documents')}</PageHeader>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
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
          </Stack>
          {hasAccess('governing_document:write') && (
          <Link href={routes.newGoverningDocument}>
            <Button
              variant="contained"
              sx={{ width: 'fit-content' }}
            >
              Create new
            </Button>
          </Link>
          )}
        </Stack>

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
