import { Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import genGetProps from '~/functions/genGetServerSideProps';
import {
  useCreateProductMutation,
} from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import ProductEditor from '~/components/Webshop/ProductEditor';

export default function CreateProductPage() {
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const [createProduct] = useCreateProductMutation({
    onCompleted: () => {
      showMessage('Product created', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error creating product');
    },
  });
  return (
    <Stack spacing={2}>
      <ProductEditor
        onFinish={async (input) => {
          await createProduct({ variables: { input } });
        }}
      />
    </Stack>
  );
}

export const getStaticProps = genGetProps(['webshop']);
