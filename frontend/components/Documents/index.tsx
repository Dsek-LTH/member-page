import {
  Button, Chip, Paper,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import {
  useCallback, useEffect, useState,
} from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import Link from '../Link';
import { useFilesQuery } from '~/generated/graphql';
import proccessFilesData, { Category } from './proccessFilesData';

const Meeting = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-top: 1rem;
  max-width: 50%;
`;

const File = styled(Box)`
  margin-top: 1rem;
`;

export default function Documents() {
  const [selectedDocument, setSelectedDocument] = useState<Category>({ meetings: [], title: '' });
  const [documents, setDocuments] = useState<Category[]>([]);
  const apiContext = useApiAccess();

  const { data: files } = useFilesQuery({ variables: { bucket: 'documents', prefix: 'public/', recursive: true } });
  if (files?.files) {
    proccessFilesData(files.files);
  }

  const admin = hasAccess(apiContext, 'fileHandler:documents:create');

  const fetchDocuments = useCallback(() => {
    if (files?.files) {
      const processedData = proccessFilesData(files.files);
      setDocuments(processedData);
      setSelectedDocument(processedData[processedData.length - 1]);
    }
  }, [files]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, files]);

  return (
    <>
      {admin && (
        <Link href="/documents/admin">Gå till filhanteraren</Link>
      )}
      <h3>Filtrera på år</h3>

      {documents.map((document) => (
        <Chip
          color={document.title === selectedDocument.title ? 'primary' : 'default'}
          onClick={() => {
            setSelectedDocument(document);
          }}
          label={document.title}
          key={`chip-key${document.title}`}
          style={{ marginRight: '1rem' }}
        />
      ))}
      {documents.length > 0
        ? selectedDocument.meetings.map((meeting) => (
          <Meeting key={meeting.title}>
            <h2 style={{ marginTop: 0 }}>{meeting.title}</h2>
            {meeting.files.map((file) => (
              <File key={`file-${file.name}`}>
                <Button variant="contained" target="_blank" href={file.thumbnailUrl}>
                  <ArticleIcon style={{ marginRight: '0.5rem' }} />
                  {file.name}
                </Button>
              </File>
            ))}
          </Meeting>
        ))
        : null}
    </>
  );
}
