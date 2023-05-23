import {
  Select, Stack, TextField, MenuItem, Button, FormControl, InputLabel, FormGroup,
} from '@mui/material';
import { useState } from 'react';
import { GoverningDocumentType, GoverningDocument } from '~/generated/graphql';

export default function GoverningDocumentsEditor({ editorType, onFinish, defaultDocument }:
{
  editorType: 'create' | 'edit',
  onFinish: (title: string, url: string, type: GoverningDocumentType) => void
  defaultDocument?: GoverningDocument
}) {
  const [title, setTitle] = useState(defaultDocument?.title ?? '');
  const [url, setUrl] = useState(defaultDocument?.url ?? '');
  const [type, setType] = useState<GoverningDocumentType>(
    defaultDocument?.type ?? GoverningDocumentType.Policy,
  );
  return (
    <Stack spacing={2}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormGroup row>
        <TextField
          sx={{ width: '250px' }}
          placeholder="https://github.com/Dsek-LTH/"
          disabled
        />
        <TextField
          sx={{ flex: 1 }}
          label="Pathname"
          helperText="example: reglemente/releases/download/latest/reglemente.pdf"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </FormGroup>
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
        onClick={() => onFinish(title, url, type)}
        variant="contained"
      >
        {editorType === 'create' ? 'Create' : 'Save'}
      </Button>
    </Stack>

  );
}
