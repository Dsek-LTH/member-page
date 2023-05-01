import { Button, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import ArticleIcon from '@mui/icons-material/Article';
import { GoverningDocument } from '~/generated/graphql';

export default function Base({ translationKey, governingDocuments }:
{ translationKey: string, governingDocuments: GoverningDocument[] }) {
  const { t } = useTranslation();
  return (
    <Stack>
      <h2>{t(translationKey)}</h2>
      {governingDocuments?.map((governingDocument) => (
        <Button
          key={governingDocument.id}
          sx={{ width: 'fit-content' }}
          variant="contained"
          target="_blank"
          rel="noopener noreferrer"
          href={governingDocument.url}
          download
        >
          <ArticleIcon style={{ marginRight: '0.5rem' }} />
          {governingDocument.title}
        </Button>
      ))}
    </Stack>
  );
}
