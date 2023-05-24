import { Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import displayPdf from '~/functions/urlFunctions';
import { GoverningDocument } from '~/generated/graphql';
import DocumentButton from './DocumentButton';
import PageHeader from '~/components/PageHeader';

export default function Base({ translationKey, governingDocuments, refetch }:
{ translationKey: string, governingDocuments: GoverningDocument[], refetch: () => void }) {
  const { t } = useTranslation();
  return (
    <Stack>
      <PageHeader>{t(translationKey)}</PageHeader>
      <Stack spacing={2}>
        {governingDocuments?.map((governingDocument) => (
          <DocumentButton
            key={governingDocument.id}
            title={governingDocument.title}
            url={displayPdf(governingDocument.url)}
            icon="article"
            governingDocumentId={governingDocument.id}
            refetch={refetch}
          />
        ))}
      </Stack>
    </Stack>
  );
}
