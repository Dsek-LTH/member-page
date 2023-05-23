import { gql } from 'apollo-server';

export const GetGoverningDocument = gql`
    query GetGoverningDocument($id: UUID!) {
        governingDocument(id: $id) {
            id
            title
            url
            type
        }
    }
`;

export const GetGoverningDocuments = gql`
    query GetGoverningDocuments {
        governingDocuments {
            id
            title
            url
            type
        }
    }
`;

export const GetPolicies = gql`
    query GetPolicies {
        policies {
            id
            title
            url
            type
        }
    }
`;

export const GetGuidelines = gql`
    query GetGuidelines {
        guidelines {
            id
            title
            url
            type
        }
    }
`;
