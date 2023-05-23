import { convertGoverningDocument } from '~/src/datasources/GoverningDocumentsAPI';
import * as sql from '~/src/types/governingDocuments';

export const governingDocuments: sql.GoverningDocument[] = [
  {
    id: 'ea41d574-6c67-435b-923d-bb3e649b3f79',
    title: 'first policy',
    url: 'https://example.com',
    document_type: sql.GoverningDocumentType.Policy,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '789fd49e-f63c-4566-92f4-9addffffdf4d',
    title: 'second policy',
    url: 'https://example.com',
    document_type: sql.GoverningDocumentType.Policy,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '5db69993-9410-4ae2-9344-d7bbf16eb2aa',
    title: 'first guideline',
    url: 'https://example.com',
    document_type: sql.GoverningDocumentType.Guideline,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'db3d7220-997b-440d-8dad-53a0ae1f699c',
    title: 'second guideline',
    url: 'https://example.com',
    document_type: sql.GoverningDocumentType.Guideline,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const governingDocumentsGraphql = governingDocuments.map(convertGoverningDocument);
