import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import {
  useCreateProductMutation,
  useProductCategoriesQuery,
} from '~/generated/graphql';
import LoadingButton from '../LoadingButton';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import { useTranslation } from 'next-i18next';
import { useApiAccess } from '~/providers/ApiAccessProvider';

export default function CreateProduct() {
  const { data: categoriesData } = useProductCategoriesQuery();
  const categories = categoriesData?.productCategories || [];
  const [categoryId, setCategoryId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [maxPerUser, setMaxPerUser] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const { t } = useTranslation();
  const [createProduct] = useCreateProductMutation({
    variables: {
      input: {
        categoryId,
        name,
        description,
        imageUrl,
        maxPerUser: Number(maxPerUser),
        price: Number(price),
        quantity: Number(quantity),
        variants: [],
      },
    },
    onCompleted: () => {
      showMessage('Product created', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error creating product');
    },
  });
  const { showMessage } = useSnackbar();
  const { hasAccess } = useApiAccess();
  if (!hasAccess('webshop:create')) {
    return (
      <Stack spacing={2}>
        <h2>Create New Product</h2>
        <p>{t('no_permission_page')}</p>
      </Stack>
    );
  }
  return (
    <Stack spacing={2}>
      <h2>Create New Product</h2>
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
      <TextField
        label="Quantity (how many can we sell?)"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
        }}
      />
      <LoadingButton
        variant="contained"
        disabled={
          !name ||
          !description ||
          !categoryId ||
          !imageUrl ||
          !maxPerUser ||
          !price ||
          !quantity ||
          Number(maxPerUser) < 0 ||
          Number(price) < 0 ||
          Number(quantity) < 0
        }
        onClick={async (e) => {
          await createProduct();
        }}
      >
        Create product
      </LoadingButton>
    </Stack>
  );
}
