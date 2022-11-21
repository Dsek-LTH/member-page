import { Stack, styled } from '@mui/material';
import { useProductsQuery } from '~/generated/graphql';
import Product from './Product';

const ProductsStack = styled(Stack)`
  direction: row;
  flex-wrap: wrap;
  margin-top: -1rem;
  margin-left: -1rem;
  margin-right: -1rem;
`;

export default function Products({ categoryId }: { categoryId?: string }) {
  const { data } = useProductsQuery({ variables: { categoryId } });
  const products = data?.products || [];
  return (
    <ProductsStack direction="row">
      {products.map((product) => (
        <Product product={product} key={product.id} />
      ))}
    </ProductsStack>
  );
}
