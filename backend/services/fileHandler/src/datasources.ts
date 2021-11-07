import { knex } from 'dsek-shared';

import FilesAPI from './datasources/Documents';

export interface DataSources {
  filesAPI: FilesAPI,
}

export default () => {
  return {
    filesAPI: new FilesAPI(knex),
  }
}