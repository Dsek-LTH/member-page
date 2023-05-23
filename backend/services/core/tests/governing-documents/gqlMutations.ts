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

export const UpdateGoverningDocument = gql`
    mutation UpdateGoverningDocument($input: UpdateGoverningDocument!) {
        governingDocument {
            update(input: $input) {
                id
                title
                url
                type
            }
        }
    }
`;

export const DeleteGoverningDocument = gql`
    mutation DeleteGoverningDocument($id: UUID!) {
        governingDocument {
            delete(id: $id)
        }
    }
`;
