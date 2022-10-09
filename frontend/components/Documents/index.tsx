import {
  Button, Chip, CircularProgress, Paper, Stack,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import {
  useCallback, useEffect, useState,
} from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import Link from '../Link';
import { useFilesQuery } from '~/generated/graphql';
import proccessFilesData, { Meeting } from './proccessFilesData';

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
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const apiContext = useApiAccess();

  const { data: files, loading } = useFilesQuery({ variables: { bucket: 'documents', prefix: `public/${selectedYear}`, recursive: true } });
  const { data: yearsFiles, loading: loadingYears } = useFilesQuery({ variables: { bucket: 'documents', prefix: 'public/' } });
  const years = yearsFiles?.files.map((file) => file.id.split('/')[1]);

  const admin = hasAccess(apiContext, 'fileHandler:documents:create');

  const fetchDocuments = useCallback(() => {
    if (files?.files) {
      const processedData = proccessFilesData(selectedYear, files.files);
      setMeetings(processedData);
    }
  }, [files?.files, selectedYear]);

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
            {years?.map((year) => (
              <Chip
                color={year === selectedYear ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedYear(year);
                }}
                label={year}
                key={`chip-key${year}`}
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
      {meetings.length > 0
        ? selectedFilter.filter(meetings).map((meeting) => (
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
      {(loading || loadingYears) && <CircularProgress />}
    </>
  );
}
