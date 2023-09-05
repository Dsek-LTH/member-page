import { Chip, Stack } from '@mui/material';
import { useEffect } from 'react';
import { ProductCategory, useProductCategoriesQuery } from '~/generated/graphql';

interface ProductCategoriesProps {
  selectedCategory: ProductCategory | null;
  setSelectedCategory: (category: ProductCategory | null) => void;
}

export default function ProductCategories(
  { selectedCategory, setSelectedCategory }: ProductCategoriesProps,
) {
  const { data } = useProductCategoriesQuery();
  useEffect(() => {
    const categories = data?.productCategories ?? []; // required for deps to work
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [data?.productCategories, setSelectedCategory]);
  const categories = data?.productCategories ?? [];
  return (
    <Stack direction="row">
      {categories.map((category) => (
        <Chip
          color={category.id === selectedCategory?.id ? 'primary' : 'default'}
          onClick={() => {
            setSelectedCategory(category);
          }}
          label={category.name}
          key={`chip-key${category.id}`}
          style={{ marginRight: '1rem' }}
        />
      ))}
    </Stack>
  );
}
