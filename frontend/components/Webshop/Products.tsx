import
{
  Box,
  CircularProgress, Fade, Stack,
} from '@mui/material';
import { useProductsQuery } from '~/generated/graphql';
import Product from './Product';

export default function Products({ categoryId }: { categoryId?: string }) {
  const { data, loading } = useProductsQuery({ variables: { categoryId } });
  const products = data?.products;
  return (
    <>
      <Box sx={{
        position: 'absolute',
        top: '4rem',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <Fade
          in={loading}
          style={{ transitionDelay: '100ms' }}
        >
          <CircularProgress />

        </Fade>
      </Box>
      <Fade
        in={!loading}
      >
        <Stack
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(40ch, 100%), 1fr))',
            gap: 2,
          }}
        >
          {products?.map((product) => (
            <Product product={product} key={product.id} />
          ))}
        </Stack>

      </Fade>

    </>
  );
}
