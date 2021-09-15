import { knex } from 'dsek-shared';

import DocumentsAPI from './datasources/Documents';

export interface DataSources {
  documentsAPI: DocumentsAPI,
}

export default () => {
  return {
    documentsAPI: new DocumentsAPI(knex),
  }
}