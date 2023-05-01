import { gql } from 'apollo-server';

export const CreateGoverningDocument = gql`
    mutation CreateGoverningDocument($title: String!, $url: String!, $type: GoverningDocumentType!) {
        governingDocument {
            create(input: { title: $title, url: $url, type: $type }) {
                title
                url
                type
            }
        }
    }
`;

export const hej = 'hej';
