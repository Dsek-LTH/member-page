import {
  Select, Stack, TextField, MenuItem, Button, FormControl, InputLabel,
} from '@mui/material';
import { useState } from 'react';
import genGetProps from '~/functions/genGetServerSideProps';
import { GoverningDocumentType, useCreateGoverningDocumentMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';

export default function NewGoverningDocument() {
  const [createGoverningDocument] = useCreateGoverningDocumentMutation();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<GoverningDocumentType>(GoverningDocumentType.Policy);
  const { hasAccess, apisLoading } = useApiAccess();
  const { showMessage } = useSnackbar();

  if (apisLoading) return null;

  if (!hasAccess('governing_document:write')) {
    return <h2>Access denied</h2>;
  }

  return (
    <Stack spacing={2}>
      <h2>Create new governing document</h2>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <FormControl>
        <InputLabel id="document-type-label">Document Type</InputLabel>
        <Select
          labelId="document-type-label"
          value={type}
          onChange={(e) => setType(e.target.value as GoverningDocumentType)}
          label="Document Type"
        >
          <MenuItem value={GoverningDocumentType.Policy}>Policy</MenuItem>
          <MenuItem value={GoverningDocumentType.Guideline}>Guideline</MenuItem>
        </Select>
      </FormControl>
      <Button
        onClick={async () => {
          await createGoverningDocument({
            variables: {
              title,
              url,
              type,
            },
          });
          showMessage('Document created', 'success');
        }}
        variant="contained"
      >
        Create
      </Button>
    </Stack>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
