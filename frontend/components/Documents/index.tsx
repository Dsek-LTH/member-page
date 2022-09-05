import {
  Button, Chip, Paper,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import { useEffect, useState } from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import { Document } from '~/pages/api/cloudinary/documents';

const Meeting = styled(Paper)`
  padding: 1rem;
  margin-top: 1rem;
  max-width: 50%;
`;

const File = styled(Box)`
  margin-top: 1rem;
`;

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
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
    fetch(`/api/cloudinary/documents?prefix=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => setDocuments(data));
  }, [selectedCategory]);
  return (
    <>
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
        ? documents[0].meetings.map((document) => (
          <Meeting key={document.title}>
            <h2 style={{ marginTop: 0 }}>{document.title}</h2>
            {document.files.map((file) => (
              <File key={`file-${file.title}`}>
                <Button variant="contained" target="_blank" href={file.secure_url}>
                  <ArticleIcon style={{ marginRight: '0.5rem' }} />
                  {file.title}
                </Button>
              </File>
            ))}
          </Meeting>
        ))
        : null}
    </>
  );
}
