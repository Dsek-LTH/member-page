import { Stack } from '@mui/material';
import { useState } from 'react';
import { ProductCategory } from '~/generated/graphql';
import ProductCategories from './ProductCategories';
import Products from './Products';

export default function Webshop() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(null);
  return (
    <Stack spacing={2}>
      <ProductCategories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Products categoryId={selectedCategory?.id} />
    </Stack>
  );
}
