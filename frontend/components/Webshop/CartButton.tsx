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
  CardActionArea,
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
import { useRouter } from 'next/router';
import routes from '~/routes';


function getQuantityInMyCart(productId: string, myCart?: MyCartQuery['myCart']) {
  if (!myCart) return 0;
  const cartItem = myCart?.cartItems.find((p) => p.id === productId);
  if (!cartItem) return 0;
  const quantities = cartItem.inventory.map((i) => i.quantity);
  return quantities.reduce((a, b) => a + b, 0);
}

export default function CartButton({ product }){
  const { t } = useTranslation();
  const { refetch: refetchMyCart, data } = useMyCartQuery();
  const quantityInMyCart = getQuantityInMyCart(product.id, data?.myCart);
  const [selectedVariant, setSelectedVariant] = useState(product.inventory[0]);
  const { showMessage } = useSnackbar();
  const { refetch: refetchProducts } = useProductsQuery(
    { variables: { categoryId: product.category.id } },
  );
  
  const [addToMyCart] = useAddToMyCartMutation({
    onError: (error) => {
      handleApolloError(error, showMessage, t);
    },
  });

  return (
    <Button
            aria-label={t('webshop:add_to_cart')}
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
            {t('webshop:add_to_cart')}
    </Button>
  )

}