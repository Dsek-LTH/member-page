import {
  Button, Dialog, DialogContent, DialogTitle, IconButton, Stack,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { useState } from 'react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import { useDeleteGoverningDocumentMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import Link from '../Link';
import routes from '~/routes';
import displayPdf from '~/functions/urlFunctions';

export default function DocumentButton({
  url, title, icon, governingDocumentId, refetch,
}: { url: string, title: string, icon: 'gavel' | 'article', governingDocumentId?: string, refetch?: () => void }) {
  const [open, setOpen] = useState(false);
  const { hasAccess } = useApiAccess();
  const [remove] = useDeleteGoverningDocumentMutation();
  return (
    <Stack direction="row" spacing={1}>
      <Button
        sx={{ width: 'fit-content' }}
        variant="contained"
        target="_blank"
        rel="noopener noreferrer"
        href={displayPdf(url)}
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
        href={displayPdf(url)}
      >
        <DownloadIcon />
      </IconButton>
      {
        (hasAccess('governing_document:write') && governingDocumentId) && (
          <>
            <IconButton
              onClick={async () => {
                await remove({ variables: { id: governingDocumentId } });
                if (refetch) refetch();
              }}
            >
              <DeleteIcon />
            </IconButton>
            <Link
              href={routes.editGoverningDocument(governingDocumentId)}
            >
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
          </>
        )
      }
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg" sx={{ height: '100%' }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={displayPdf(url)} />
          </Worker>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
