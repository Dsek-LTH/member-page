import {
  Button, Chip, Paper, IconButton,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import {
  useCallback, useEffect, useState, ChangeEvent,
} from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import { Document } from '~/pages/api/cloudinary/documents';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

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
  const [selectedCategory, setSelectedCategory] = useState('2022');
  const [categories, setCategories] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const apiContext = useApiAccess();

  const admin = hasAccess(apiContext, 'fileHandler:documents:create');

  const fetchDocuments = useCallback(() => {
    fetch(`/api/cloudinary/documents?prefix=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => setDocuments(data));
  }, [selectedCategory]);

  const uploadDocument = useCallback(
    async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, meeting: string) => {
      const input = event.target as HTMLInputElement;
      const file = input?.files[0];
      const body = new FormData();
      body.append('file', file);

      await fetch(`/api/cloudinary/upload?meeting=${meeting}&category=${selectedCategory}&title=${file.name.split('.pdf')[0]}`, { method: 'post', body });
      fetchDocuments();
    },
    [fetchDocuments, selectedCategory],
  );

  useEffect(() => {
    fetch('/api/cloudinary/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setSelectedCategory(data[0]);
      });
  }, []);

  useEffect(() => {
    setDocuments([]);
    fetchDocuments();
  }, [fetchDocuments, selectedCategory]);
  return (
    <>
      {admin && (
        <Button
          variant="contained"
          onClick={() => {
            const title = window.prompt('Vad ska mötet heta?');
            if (title) {
              fetch(`/api/cloudinary/new_meeting?title=${title}&category=${selectedCategory}`).then(() => fetchDocuments());
            }
          }}
        >
          Nytt möte
        </Button>
      )}
      <h3>Filtrera på år</h3>

      {categories.map((category) => (
        <Chip
          color={category === selectedCategory ? 'primary' : 'default'}
          onClick={() => {
            setSelectedCategory(category);
          }}
          label={category}
          key={`chip-key${category}`}
          style={{ marginRight: '1rem' }}
        />
      ))}
      {documents.length > 0
        ? documents[0].meetings.map((meeting) => (
          <Meeting key={meeting.title}>
            <h2 style={{ marginTop: 0 }}>{meeting.title}</h2>
            {meeting.files.map((file) => (
              <File key={`file-${file.title}`}>
                <Button variant="contained" target="_blank" href={file.secure_url}>
                  <ArticleIcon style={{ marginRight: '0.5rem' }} />
                  {file.title}
                </Button>
                {admin && (
                  <IconButton
                    onClick={() => {
                      const result = window.confirm('Är du säker på att du vill ta bort den här handlingen?');
                      if (result) {
                        fetch(`/api/cloudinary/delete_document?public_id=${file.public_id}`).then(() => fetchDocuments());
                      }
                    }}
                    style={{ marginLeft: '0.25rem' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </File>
            ))}
            {admin && (
              <div style={{ display: 'flex', marginTop: '1rem' }}>
                <Button
                  component="label"
                >
                  Ladda upp dokument
                  <input
                    onChange={(event) => {
                      uploadDocument(event, meeting.title);
                    }}
                    type="file"
                    hidden
                  />
                </Button>
                <Button
                  onClick={() => {
                    const result = window.confirm('Är du säker på att du vill ta bort mötet?');
                    if (result) {
                      fetch(`/api/cloudinary/delete_meeting?meeting=${meeting.title}&category=${selectedCategory}`).then(() => fetchDocuments());
                    }
                  }}
                  color="error"
                  variant="contained"
                  style={{ marginLeft: 'auto' }}
                >
                  Ta bort möte

                </Button>
              </div>

            )}
          </Meeting>
        ))
        : null}
    </>
  );
}
