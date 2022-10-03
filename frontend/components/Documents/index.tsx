import { Chip } from '@mui/material';
import {
  useCallback, useEffect, useState,
} from 'react';
import { LoadingButton } from '@mui/lab';
import { Document } from '~/pages/api/cloudinary/documents';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import Meeting from './Meeting';

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState('2022');
  const [categories, setCategories] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const [loadingCreateMeeting, setLoadingCreateMeeting] = useState(false);

  const apiContext = useApiAccess();

  const canCreate = hasAccess(apiContext, 'fileHandler:documents:create');

  const fetchDocuments = useCallback(async () => {
    await fetch(`/api/cloudinary/documents?prefix=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
      });
  }, [selectedCategory]);

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
      {canCreate && (
        <LoadingButton
          variant="contained"
          loading={loadingCreateMeeting}
          onClick={() => {
            const title = window.prompt('Vad ska mötet heta?');
            if (title) {
              setLoadingCreateMeeting(true);
              fetch(
                `/api/cloudinary/new_meeting?title=${title}&category=${selectedCategory}`,
              ).then(() => fetchDocuments());
            }
          }}
        >
          Nytt möte
        </LoadingButton>
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
          <Meeting
            key={meeting.title}
            meeting={meeting}
            selectedCategory={selectedCategory}
            fetchDocuments={fetchDocuments}
          />
        ))
        : null}
    </>
  );
}
