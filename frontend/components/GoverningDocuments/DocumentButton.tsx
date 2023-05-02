import {
  Button, Dialog, DialogContent, DialogTitle, IconButton, Stack,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { useState } from 'react';

import '@react-pdf-viewer/core/lib/styles/index.css';

export default function DocumentButton({ url, title, icon }: { url: string, title: string, icon: 'gavel' | 'article' }) {
  const [open, setOpen] = useState(false);
  const viewUrl = `/api/pdf?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  return (
    <Stack direction="row" spacing={1}>
      <Button
        sx={{ width: 'fit-content' }}
        variant="contained"
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        {icon === 'gavel' && <GavelIcon style={{ marginRight: '0.5rem' }} />}
        {icon === 'article' && <ArticleIcon style={{ marginRight: '0.5rem' }} />}
        {title}
      </Button>
      <IconButton
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        download
      >
        <DownloadIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg" sx={{ height: '100%' }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={viewUrl} />
          </Worker>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
