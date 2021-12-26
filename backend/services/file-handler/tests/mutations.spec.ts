import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { FileData } from 'chonky';
import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';
import { FileChange } from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const fileChange: FileChange = {
  oldFile: {
    id: 'public/filename.png',
    name: 'filename.png',
    size: 100,
  },
  file: {
    id: 'public/filename1.png',
    name: 'filename1.png',
    size: 100,
  },
};

const fileData: FileData = {
  id: 'public/filename.png',
  name: 'filename.png',
  size: 100,
};
const renameObjectQuery = gql`
mutation renameObject($bucket: String!, $fileName: String!, $newFileName: String!) {
  files {
    rename(bucket: $bucket, fileName: $fileName, newFileName: $newFileName ){
      file{
        id
        name
        size
        isDir
        thumbnailUrl
      },
    }
  }
}
`;
const moveObjectQuery = gql`
mutation moveObjects($bucket: String!, $fileNames: [String!]!, $destination: String!) {
  files {
    move(bucket: $bucket, fileNames: $fileNames, newFolder: $destination ) {
      file{
        id
        name
        size
        isDir
        thumbnailUrl
      },
      oldFile{
        id
        name
        size
        isDir
        thumbnailUrl
      }
    }
  }
}
`;

const removeObjectQuery = gql`
mutation removeObjects($bucket: String!, $fileNames: [String!]!) {
  files {
    remove(bucket: $bucket, fileNames: $fileNames ) {
      id
      name
    }
  }
}
`;

describe('[Mutations]', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  beforeEach(() => {
    sandbox.on(dataSources.filesAPI, 'removeObjects', () => [fileData]);
    sandbox.on(dataSources.filesAPI, 'moveObject', () => fileChange);
    sandbox.on(dataSources.filesAPI, 'renameObject', () => fileChange);
  });

  afterEach(() => {
    sandbox.restore();
  });

  before(() => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;

    const c = createTestClient(server);
    client = c;
  });

  describe('move', () => {
    it('should return moved files', async () => {
      await client.query({ query: moveObjectQuery, variables: { bucket: 'documnets', fileNames: ['public/filename.png'], destination: 'public/folder/' } });
      expect(dataSources.filesAPI.moveObject).to.have.been.called();
    });
  });
  describe('remove', () => {
    it('should return a removed file', async () => {
      await client.query({ query: removeObjectQuery, variables: { bucket: 'documnets', fileNames: ['public/filename.png'] } });
      expect(dataSources.filesAPI.removeObjects).to.have.been.called();
    });
  });

  describe('rename', () => {
    it('should return a renames files', async () => {
      await client.query({ query: renameObjectQuery, variables: { bucket: 'documnets', fileName: 'public/filename.png', newFileName: 'filename1.png' } });
      expect(dataSources.filesAPI.renameObject).to.have.been.called();
    });
  });
});
