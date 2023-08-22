import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import Link from 'next/link';
import {
  CreateProductInput,
  ProductQuery,
  useProductCategoriesQuery,
} from '~/generated/graphql';
import LoadingButton from '../LoadingButton';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import DateTimePicker from '../DateTimePicker';

export default function ProductEditor({
  existingProduct,
  onFinish,
}: {
  existingProduct?: ProductQuery['product'];
  onFinish: (input: CreateProductInput) => Promise<void>;
}) {
  const { data: categoriesData } = useProductCategoriesQuery();
  const categories = categoriesData?.productCategories || [];
  const [categoryId, setCategoryId] = useState<string>(existingProduct?.category?.id || '');
  const [name, setName] = useState<string>(existingProduct?.name || '');
  const [description, setDescription] = useState<string>(existingProduct?.description || '');
  const [imageUrl, setImageUrl] = useState<string>(existingProduct?.imageUrl || '');
  const [maxPerUser, setMaxPerUser] = useState<string>(existingProduct?.maxPerUser?.toString() || '');
  const [price, setPrice] = useState<string>(existingProduct?.price?.toString() || '');
  const [releaseDate, setReleaseDate] = useState(DateTime.now());
  const { t } = useTranslation();
  const { hasAccess } = useApiAccess();
  if (!hasAccess('webshop:create')) {
    return (
      <Stack spacing={2}>
        {existingProduct && <h2>Edit Product</h2>}
        {!existingProduct && <h2>Create New Product</h2>}
        <p>{t('no_permission_page')}</p>
      </Stack>
    );
  }
  return (
    <Stack spacing={2}>
      {existingProduct && <h2>Edit Product</h2>}
      {!existingProduct && <h2>Create New Product</h2>}
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
      />
      <FormControl>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          label="Category"
          labelId="category-select-label"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <TextField
        label="Max per user"
        value={maxPerUser}
        onChange={(e) => {
          setMaxPerUser(e.target.value);
        }}
      />
      <TextField
        label="Price in SEK"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />
      <DateTimePicker value={releaseDate} onChange={setReleaseDate} label="Release date" />
      <Stack direction="row" spacing={2}>
        <LoadingButton
          variant="contained"
          disabled={
          !name
          || !description
          || !categoryId
          || !imageUrl
          || !maxPerUser
          || !price
          || Number(maxPerUser) < 0
          || Number(price) < 0
        }
          onClick={async () => {
            await onFinish({
              name,
              description,
              categoryId,
              imageUrl,
              maxPerUser: Number(maxPerUser),
              price: Number(price),
              releaseDate,

            });
          }}
        >
          {existingProduct && 'Save Product'}
          {!existingProduct && 'Create New Product'}
        </LoadingButton>
        <Link href={existingProduct ? `/webshop/product/${existingProduct.id}/manage` : '/webshop'} passHref>
          <Button>Cancel</Button>
        </Link>
      </Stack>
    </Stack>
  );
}
