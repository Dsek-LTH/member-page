import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'password',
});

export default client;
