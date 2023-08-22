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
import Link from 'next/link';
import {
  MyCartQuery,
  ProductsQuery, useAddToMyCartMutation, useMyCartQuery, useProductsQuery,
} from '~/generated/graphql';
import handleApolloError from '~/functions/handleApolloError';
import { useSnackbar } from '~/providers/SnackbarProvider';
import { useApiAccess } from '~/providers/ApiAccessProvider';

function getQuantityInMyCart(productId: string, myCart?: MyCartQuery['myCart']) {
  if (!myCart) return 0;
  const cartItem = myCart?.cartItems.find((p) => p.id === productId);
  if (!cartItem) return 0;
  const quantities = cartItem.inventory.map((i) => i.quantity);
  return quantities.reduce((a, b) => a + b, 0);
}

// time diff in milliseconds
const timeDiff = (date1: Date, date2: Date) => {
  const diff = date2.getTime() - date1.getTime();
  return diff;
};

// milliseconds to days, hours, minutes and seconds
const msToTime = (duration: number) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const days = Math.floor((duration / (1000 * 60 * 60 * 24)));
  let output = '';
  if (duration > (1000 * 60 * 60 * 24)) { output += `${days}d `; }
  if (duration > (1000 * 60 * 60)) { output += `${hours}h `; }
  if (duration > (1000 * 60)) { output += `${minutes}m `; }
  output += `${seconds}s`;
  return output;
};

export default function Product({ product }: { product: ProductsQuery['products'][number] }) {
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const [selectedVariant, setSelectedVariant] = useState(product.inventory[0]);
  const [timeLeft, setTimeLeft] = useState(1);
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

    let interval;
    if (new Date(product.releaseDate) > new Date()) {
      setTimeLeft(timeDiff(new Date(), new Date(product.releaseDate)));
      // update timeleft every second
      interval = setInterval(() => {
        setTimeLeft(timeDiff(new Date(), new Date(product.releaseDate)));
      }, 1000);
      const msRemaining = timeDiff(new Date(product.releaseDate), new Date());
      setTimeout(() => {
        setTimeLeft(0);
      }, msRemaining);
    } else {
      setTimeLeft(0);
    }
    return () => clearInterval(interval);
  }, [product]);

  const { hasAccess } = useApiAccess();

  return (
    <Card sx={{
      margin: '0.5rem',
      width: { xs: '100%', sm: '20rem' },
      display: 'flex',
      flexDirection: 'column',
    }}
    >
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
      <CardActions sx={{ marginTop: 'auto' }}>
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

          {hasAccess('webshop:create') && (
            <Link passHref href={`/webshop/product/${product.id}/manage`}>
              <Button>Manage Product</Button>
            </Link>
          )}

          {
            timeLeft <= 0 && (
            <Button
              aria-label={t('webshop:add_to_cart')}
              variant="contained"
              disabled={
              !selectedVariant || selectedVariant.quantity === 0
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
              {t('webshop:add_to_cart')}
            </Button>
            )
          }
          {
            timeLeft > 0 && (
              <Typography>
                Biljetter släpps om:
                {' '}
                {msToTime(timeLeft)}
              </Typography>
            )
          }
        </Stack>
      </CardActions>
    </Card>
  );
}
