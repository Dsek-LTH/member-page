import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import
{
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import handleApolloError from '~/functions/handleApolloError';
import
{
  MyCartQuery,
  MyChestQuery,
  ProductsQuery, useAddToMyCartMutation, useMyCartQuery, useMyChestQuery, useProductsQuery,
} from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import { useUser } from '~/providers/UserProvider';

function getQuantityInMyCart(productId: string, myCart?: MyCartQuery['myCart'], myChest?: MyChestQuery['chest']) {
  const cartItem = myCart?.cartItems.find((p) => p.id === productId);
  const chestItems = myChest?.items.filter((p) => p.productId === productId);
  let quantity = 0;
  if (cartItem) {
    const quantities = cartItem.inventory.map((i) => i.quantity);
    quantity += quantities.reduce((a, b) => a + b, 0);
  }
  if (chestItems?.length) {
    quantity += chestItems.length;
  }
  return quantity;
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
  const { t } = useTranslation('webshop');
  const { user } = useUser();
  const { showMessage } = useSnackbar();
  const [selectedVariant, setSelectedVariant] = useState(product.inventory[0]);
  const [timeLeft, setTimeLeft] = useState(Number.MAX_VALUE);
  const { refetch: refetchMyCart, data } = useMyCartQuery();
  const { data: chestData } = useMyChestQuery({
    variables: { studentId: user?.student_id },
  });
  const quantityInMyCart = getQuantityInMyCart(product.id, data?.myCart, chestData?.chest);
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
      const msRemaining = timeDiff(new Date(), new Date(product.releaseDate));
      setTimeout(() => {
        setTimeLeft(0);
      }, msRemaining);
    } else {
      setTimeLeft(0);
    }
    return () => clearInterval(interval);
  }, [product]);

  const { hasAccess } = useApiAccess();
  const canPurchase = hasAccess('webshop:use');

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
    }}
    >
      <CardMedia
        component="img"
        height="194"
        image={product.imageUrl}
        alt={product.name}
      />
      <CardHeader
        title={product.name}
        sx={{
          textAlign: 'center',
        }}
      />
      <CardContent>
        <Stack direction="row" gap={1} justifyContent="space-between" sx={{ mb: 1 }}>
          <Chip
            label={product.price === 0 ? t('free') : `${product.price} kr`}
            color="primary"
            sx={{ fontWeight: 'bold', px: 1 }}
          />
          <Stack alignItems="flex-end">
            {product.inventory.length === 1 && (
            <Typography fontWeight="bold">
              {product.inventory[0].quantity === 0 ? t('sold_out') : t('left', { amount: product.inventory[0].quantity })}
            </Typography>
            )}
            <Typography>
              {t('you_have', {
                amount: quantityInMyCart,
                total: product.maxPerUser,
              })}
            </Typography>

          </Stack>
        </Stack>
        <Typography>
          {product.description}
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
              <Tooltip title={!canPurchase ? t('logged_in_tooltip') : ''}>
                {/* span is needed for tooltip to work */}
                <span>
                  <Button
                    aria-label={t('add_to_cart')}
                    variant="contained"
                    disabled={
              !selectedVariant || selectedVariant.quantity === 0
               || quantityInMyCart >= product.maxPerUser || !canPurchase
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
                </span>
              </Tooltip>
            )
          }
          {
            timeLeft > 0 && (
              <Typography>
                {t('tickets_release_in')}
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
