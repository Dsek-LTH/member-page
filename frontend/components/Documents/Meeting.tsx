import { Paper } from '@mui/material';
import { styled } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { ChangeEvent, useCallback, useState } from 'react';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import Document from './Document';

const MeetingComponent = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-top: 1rem;
  max-width: 50%;
`;

export default function Meeting({ meeting, fetchDocuments, selectedCategory }) {
  const apiContext = useApiAccess();
  const canCreate = hasAccess(apiContext, 'fileHandler:documents:create');
  const canDelete = hasAccess(apiContext, 'fileHandler:documents:delete');

  const [loadingDeleteMeeting, setLoadingDeleteMeeting] = useState(false);
  const [loadingUploadDocument, setLoadingUploadDocument] = useState(false);

  const uploadDocument = useCallback(
    async (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      meetingName: string,
    ) => {
      setLoadingUploadDocument(true);
      const input = event.target as HTMLInputElement;
      const file = input?.files[0];
      // eslint-disable-next-line no-param-reassign
      event.target.value = null;
      const body = new FormData();
      body.append('file', file);

      await fetch(
        `/api/cloudinary/upload?meeting=${meetingName}&category=${selectedCategory}&title=${file.name.split('.pdf')[0]
        }`,
        { method: 'post', body },
      );
      await fetchDocuments();
      setLoadingUploadDocument(false);
    },
    [fetchDocuments, selectedCategory],
  );

  return (
    <MeetingComponent key={meeting.title}>
      <h2 style={{ marginTop: 0 }}>{meeting.title}</h2>
      {meeting.files.map((file) => (
        <Document key={`file-${file.title}`} file={file} fetchDocuments={fetchDocuments} />
      ))}
      {(canCreate || canDelete) && (
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          {canCreate &&
            <LoadingButton loading={loadingUploadDocument} component="label">
              Ladda upp dokument
              <input
                onChange={(event) => {
                  uploadDocument(event, meeting.title);
                }}
                type="file"
                hidden
              />
            </LoadingButton>
          }
          {canDelete && <LoadingButton
            onClick={() => {
              const result = window.confirm(
                'Är du säker på att du vill ta bort mötet?',
              );
              if (result) {
                setLoadingDeleteMeeting(true);
                fetch(
                  `/api/cloudinary/delete_meeting?meeting=${meeting.title}&category=${selectedCategory}`,
                ).then(() => {
                  fetchDocuments().then(() => {
                    setLoadingDeleteMeeting(false);
                  });
                });
              }
            }}
            loading={loadingDeleteMeeting}
            color="error"
            variant="contained"
            style={{ marginLeft: 'auto' }}
          >
            Ta bort möte
          </LoadingButton>
          }

        </div>
      )}
    </MeetingComponent>
  );
}
