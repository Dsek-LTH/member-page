import { useState } from 'react';
import { Button } from '@mui/material';
import { Box, styled } from '@mui/system';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

const File = styled(Box)`
  margin-top: 1rem;
`;
export default function Document({ file, fetchDocuments }) {
  const apiContext = useApiAccess();
  const canDelete = hasAccess(apiContext, 'fileHandler:documents:delete');

  const [loadingDeleteDocument, setLoadingDeleteDocument] = useState(false);

  return (
    <File>
      <Button variant="contained" target="_blank" href={file.secure_url}>
        <ArticleIcon style={{ marginRight: '0.5rem' }} />
        {file.title}
      </Button>
      {canDelete && (
        <LoadingButton
          loading={loadingDeleteDocument}
          onClick={() => {
            const result = window.confirm(
              'Är du säker på att du vill ta bort den här handlingen?',
            );
            if (result) {
              setLoadingDeleteDocument(true);
              fetch(
                `/api/cloudinary/delete_document?public_id=${file.public_id}`,
              ).then(() => fetchDocuments().then(() => {
                setLoadingDeleteDocument(false);
              }));
            }
          }}
          style={{ marginLeft: '0.25rem' }}
        >
          <DeleteIcon />
        </LoadingButton>
      )}
    </File>
  );
}
