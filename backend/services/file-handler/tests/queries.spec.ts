import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { FileData } from 'chonky';
import { DataSources } from '../src/datasources';
import constructTestServer from './util';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const fileData: FileData = {
  id: 'public/filename.png',
  name: 'filename.png',
  size: 100,
};

const listBucketQuery = gql`
query files($bucket: String!, $prefix: String!) {
  files(bucket: $bucket, prefix: $prefix) {
    id
    name
    size
    isDir
    thumbnailUrl
  }
}
`;

const PresignedPutUrlQuery = gql`
  query PresignedPutUrl($bucket: String!, $fileName: String!) {
    presignedPutUrl(bucket: $bucket, fileName: $fileName)
  }
`;

describe('[Queries]', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(() => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;

    const c = createTestClient(server);
    client = c;
  });

  beforeEach(() => {
    sandbox.on(dataSources.filesAPI, 'getFilesInBucket', () => [fileData]);
    sandbox.on(dataSources.filesAPI, 'getPresignedPutUrl', () => 'localhost:9000/bucket/folder/thing.png');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('files', () => {
    it('should return all files in the bucket', async () => {
      await client.query({ query: listBucketQuery, variables: { bucket: 'documnets', prefix: 'public/' } });
      expect(dataSources.filesAPI.getFilesInBucket).to.have.been.called();
    });
  });
  describe('presignedPutUrl', () => {
    it('should return a presigned url', async () => {
      await client.query({ query: PresignedPutUrlQuery, variables: { bucket: 'documnets', fileName: 'public/filename.png' } });
      expect(dataSources.filesAPI.getPresignedPutUrl).to.have.been.called();
    });
  });
});
