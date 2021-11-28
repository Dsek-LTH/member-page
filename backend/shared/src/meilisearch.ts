import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
    host: process.env.MEILI_HOST || '',
    apiKey: process.env.MEILI_MASTER_KEY || '',
});

export default client;