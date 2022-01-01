import { knex } from 'dsek-shared';

import FilesAPI from './datasources/Files';

export interface DataSources {
  filesAPI: FilesAPI,
}

export default () => ({
  filesAPI: new FilesAPI(knex),
});
