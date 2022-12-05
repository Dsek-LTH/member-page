import { gql } from 'apollo-server';

// eslint-disable-next-line import/prefer-default-export
export const SeedDatabaseQuery = gql`
  mutation SeedDatabase {
    admin {
      seed
    }
  }
`;

export const SyncMandatesWithKeycloakQuery = gql`
mutation SyncMandatesWithKeycloak {
  admin {
    syncMandatesWithKeycloak
  }
}
`;

export const UpdateSearchIndex = gql`
mutation UpdateSearchIndex {
  admin {
    updateSearchIndex
  }
}
`;
