import {
  Stack,
} from '@mui/material';
import GoverningDocumentsEditor from '~/components/GoverningDocuments/Editor';
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
    return <h2>Access denied</h2>;
  }

  return (
    <Stack>
      <h2>Create new governing document</h2>
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
