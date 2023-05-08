import {
  Stack, TextField, Button, Link,
} from '@mui/material';
import { useState } from 'react';
import genGetProps from '~/functions/genGetServerSideProps';
import displayPdf from '~/functions/urlFunctions';

export default function PdfHosting() {
  const [url, setUrl] = useState('');
  return (
    <Stack spacing={2}>
      <h1>PDF Viewer</h1>
      <p>
        Sometimes (like when you create a release and host them on GitHub)
        pdf files will be downloaded instead of displayed in the browser.
        <br />
        Here you can paste a link your pdf files and get a link that will display
        the pdf in the browser.
      </p>
      <TextField
        label="PDF URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Link
        href={displayPdf(url)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="contained" disabled={!url}>
          Open

        </Button>
      </Link>
    </Stack>
  );
}

export const getServerSideProps = genGetProps();
