import { Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { GoverningDocument } from '~/generated/graphql';
import DocumentButton from './DocumentButton';

export default function Base({ translationKey, governingDocuments }:
{ translationKey: string, governingDocuments: GoverningDocument[] }) {
  const { t } = useTranslation();
  return (
    <Stack>
      <h2>{t(translationKey)}</h2>
      <Stack spacing={2}>
        {governingDocuments?.map((governingDocument) => (
          <DocumentButton
            key={governingDocument.id}
            title={governingDocument.title}
            url={governingDocument.url}
            icon="article"
          />
        ))}
      </Stack>
    </Stack>
  );
}
