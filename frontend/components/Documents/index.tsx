import {
  Button, Chip, Paper, Stack,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import {
  useCallback, useEffect, useState,
} from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import Link from '../Link';
import { useFilesQuery } from '~/generated/graphql';
import proccessFilesData, { Category, Meeting } from './proccessFilesData';

const MeetingComponent = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-top: 1rem;
`;

const File = styled(Box)`
  margin-top: 1rem;
`;

type Filter = {
  title: string,
  filter: (meetings: Meeting[]) => Meeting[]
}

const filters: Filter[] = [
  {
    title: 'Alla',
    filter: (meetings: Meeting[]) => meetings,
  },
  {
    title: 'HTM',
    filter: (meetings: Meeting[]) => meetings.filter((meeting) => meeting.title.includes('HTM')),
  },
  {
    title: 'VTM',
    filter: (meetings: Meeting[]) => meetings.filter((meeting) => meeting.title.includes('VTM')),
  },
  {
    title: 'Styrelsemöten',
    filter: (meetings: Meeting[]) => meetings.filter((meeting) => meeting.title.match(/(S\d{2}|Styr)/)),
  },
];

export default function Documents() {
  const [selectedFilter, setSelectedFilter] = useState<Filter>(filters[0]);
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
      <Stack>
        <Stack>
          <h3>Filtrera på år</h3>
          <Stack direction="row">
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
          </Stack>
        </Stack>
        <Stack>
          <h3>Filtrera på mötestyp</h3>
          <Stack direction="row">
            {filters.map((filter) => (
              <Chip
                color={filter.title === selectedFilter.title ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedFilter(filter);
                }}
                label={filter.title}
                key={`chip-filter-key${filter.title}`}
                style={{ marginRight: '1rem' }}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
      {documents.length > 0
        ? selectedFilter.filter(selectedDocument.meetings).map((meeting) => (
          <MeetingComponent key={meeting.title}>
            <h2 style={{ marginTop: 0 }}>{meeting.title}</h2>
            {meeting.files.map((file) => (
              <File key={`file-${file.name}`}>
                <Button variant="contained" target="_blank" href={file.thumbnailUrl}>
                  <ArticleIcon style={{ marginRight: '0.5rem' }} />
                  {file.name}
                </Button>
              </File>
            ))}
          </MeetingComponent>
        ))
        : null}
    </>
  );
}
