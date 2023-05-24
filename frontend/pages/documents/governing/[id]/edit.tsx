import {
  Stack,
} from '@mui/material';
import { useRouter } from 'next/router';
import GoverningDocumentsEditor from '~/components/GoverningDocuments/Editor';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useGetGoverningDocumentQuery, useUpdateGoverningDocumentMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';

export default function NewGoverningDocument() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, loading } = useGetGoverningDocumentQuery({ variables: { id } });
  const [updateGoverningDocument] = useUpdateGoverningDocumentMutation();
  const { hasAccess, apisLoading } = useApiAccess();
  const { showMessage } = useSnackbar();

  if (apisLoading || loading) return null;

  if (!hasAccess('governing_document:write')) {
    return <PageHeader>Access denied</PageHeader>;
  }

  if (!data?.governingDocument) {
    return <PageHeader>Document not found</PageHeader>;
  }

  return (
    <Stack>
      <PageHeader>Edit governing document</PageHeader>
      <GoverningDocumentsEditor
        editorType="edit"
        defaultDocument={data.governingDocument}
        onFinish={async (title, url, type) => {
          await updateGoverningDocument({
            variables: {
              input: {
                id,
                title,
                url,
                type,
              },
            },
          });
          showMessage('Document updated', 'success');
        }}
      />
    </Stack>
  );
}

export const getServerSideProps = genGetProps(['fileBrowser']);
