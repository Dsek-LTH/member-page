import {
  Button, Stack, Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import handleApolloError from '~/functions/handleApolloError';
import {
  useDeleteProductMutation,
  useProductQuery,
} from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';

export default function ManageProduct({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const { data } = useProductQuery({
    variables: {
      id,
    },
  });
  const [deleteProduct] = useDeleteProductMutation({
    onCompleted: () => {
      showMessage('Product inventory deleted', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error deleting product inventory');
    },
  });
  const product = data?.product;

  return (
    <Stack>
      <h2>Manage product</h2>
      {data?.product && (
      <Stack spacing={2}>
        <Typography>
          Name:
          {' '}
          {product.name}
        </Typography>
        <Typography>
          Description:
          {' '}
          {product.description}
        </Typography>
        <Typography>
          Category:
          {' '}
          {product.category?.name}
        </Typography>
        <Typography>
          Image URL:
          {' '}
          <a href={product.imageUrl}>{product.imageUrl}</a>
        </Typography>
        <Typography>
          Max per user:
          {' '}
          {product.maxPerUser}
        </Typography>
        <Typography>
          Price:
          {' '}
          {product.price}
        </Typography>
        <Typography>
          Release date:
          {' '}
          {product.releaseDate}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Link href={`/webshop/product/${id}/edit`} passHref>
            <Button
              style={{
                width: 'fit-content',
              }}
              variant="contained"
            >
              Edit information
            </Button>
          </Link>
          <Button
            color="error"
            style={{
              width: 'fit-content',
            }}
            variant="contained"
            onClick={() => {
              deleteProduct({
                variables: {
                  productId: id,
                },
              });
              router.push('/webshop');
            }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
      )}
    </Stack>
  );
}
