import { Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import genGetProps from '~/functions/genGetServerSideProps';
import {
  useProductQuery,
  useUpdateProductMutation,
} from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import ProductEditor from '~/components/Webshop/ProductEditor';

export default function CreateProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const { data } = useProductQuery({
    variables: {
      id,
    },
  });
  const [updateProduct] = useUpdateProductMutation({
    onCompleted: () => {
      showMessage('Product updated', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error creating product');
    },
  });

  return (
    <Stack spacing={2}>
      {data?.product && (
      <ProductEditor
        existingProduct={data?.product}
        onFinish={async (input) => {
          await updateProduct({ variables: { input: { ...input, productId: id as string } } });
        }}
      />
      )}
    </Stack>
  );
}

export const getServerSideProps = genGetProps(['webshop']);
