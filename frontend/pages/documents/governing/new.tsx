import {
  Stack,
} from '@mui/material';
import GoverningDocumentsEditor from '~/components/GoverningDocuments/Editor';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useCreateGoverningDocumentMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';

export default function NewGoverningDocument() {
  const [createGoverningDocument] = useCreateGoverningDocumentMutation();
  const { hasAccess, apisLoading } = useApiAccess();
  const { showMessage } = useSnackbar();

  if (apisLoading) return null;

  if (!hasAccess('governing_document:write')) {
    return <PageHeader>Access denied</PageHeader>;
  }

  return (
    <Stack>
      <PageHeader>Create new governing document</PageHeader>
      <GoverningDocumentsEditor
        editorType="create"
        onFinish={async (title, url, type) => {
          await createGoverningDocument({
            variables: {
              title,
              url,
              type,
            },
          });
          showMessage('Document created', 'success');
        }}
      />
    </Stack>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
