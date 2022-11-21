import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Select,
  MenuItem,
  Stack,
  Typography,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  MyCartQuery,
  ProductsQuery, useAddToMyCartMutation, useMyCartQuery, useProductsQuery,
} from '~/generated/graphql';
import handleApolloError from '~/functions/handleApolloError';
import { useSnackbar } from '~/providers/SnackbarProvider';

function getQuantityInMyCart(productId: string, myCart?: MyCartQuery['myCart']) {
  if (!myCart) return 0;
  const cartItem = myCart?.cartItems.find((p) => p.id === productId);
  if (!cartItem) return 0;
  const quantities = cartItem.inventory.map((i) => i.quantity);
  return quantities.reduce((a, b) => a + b, 0);
}

export default function Product({ product }: { product: ProductsQuery['products'][number] }) {
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const [selectedVariant, setSelectedVariant] = useState(product.inventory[0]);
  const { refetch: refetchMyCart, data } = useMyCartQuery();
  const quantityInMyCart = getQuantityInMyCart(product.id, data?.myCart);
  const { refetch: refetchProducts } = useProductsQuery(
    { variables: { categoryId: product.category.id } },
  );
  const [addToMyCart] = useAddToMyCartMutation({
    onError: (error) => {
      handleApolloError(error, showMessage, t);
    },
  });
  useEffect(() => {
    if (selectedVariant) {
      setSelectedVariant(product.inventory
        .find((p) => p.id === selectedVariant.id) || product.inventory[0]);
    }
  }, [product]);

  return (
    <Card sx={{ margin: '0.5rem', width: { xs: '100%', sm: 'unset' } }}>
      <CardHeader
        title={product.name}
        sx={{
          textAlign: 'center',
        }}
      />
      <CardMedia
        component="img"
        height="194"
        image={product.imageUrl}
        alt={product.name}
      />
      <CardContent>
        <Typography>
          {product.description}
        </Typography>
        <Typography>
          {product.price}
          {' '}
          kr
        </Typography>
        {product.inventory.length === 1 && (
        <Typography>
          {product.inventory[0].quantity}
          {' '}
          kvar
        </Typography>
        )}
        <Typography>
          Du har
          {' '}
          {quantityInMyCart}
          /
          {product.maxPerUser}
          {' '}
          man får köpa
        </Typography>
      </CardContent>
      <CardActions>
        <Stack alignItems="center" width="100%" spacing={1}>
          {product.inventory.length > 1 && (
          <FormControl fullWidth>
            <InputLabel id={`variant-label-${product.id}`}>Variant</InputLabel>
            <Select
              id={`select-${product.id}`}
              labelId={`variant-label-${product.id}`}
              label="Variant"
              style={{ margin: '0 0.25rem' }}
              value={selectedVariant.id}
              onChange={(e) => {
                setSelectedVariant(product.inventory
                  .find((variant) => variant.id === e.target.value));
              }}
            >
              {product.inventory.map((inventory) => (
                <MenuItem key={inventory.id} value={inventory.id}>
                  {inventory.variant}
                  {' '}
                  :
                  {' '}
                  {inventory.quantity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          )}
          <Button
            aria-label={t('add_to_cart')}
            variant="contained"
            disabled={
              selectedVariant.quantity === 0
               || quantityInMyCart >= product.maxPerUser
            }
            onClick={(() => {
              addToMyCart({
                variables:
                { inventoryId: selectedVariant.id, quantity: 1 },
              }).then(() => {
                refetchMyCart();
                refetchProducts();
              });
            })}
          >
            <AddShoppingCartIcon style={{ marginRight: '1rem' }} />
            {t('add_to_cart')}
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
