import { Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { GoverningDocument } from '~/generated/graphql';
import DocumentButton from './DocumentButton';
import displayPdf from '~/functions/urlFunctions';

export default function Base({ translationKey, governingDocuments, refetch }:
{ translationKey: string, governingDocuments: GoverningDocument[], refetch: () => void }) {
  const { t } = useTranslation();
  return (
    <Stack>
      <h2>{t(translationKey)}</h2>
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
