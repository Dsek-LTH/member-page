import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useMyCartQuery } from '~/generated/graphql';
import routes from '~/routes';

export default function MyCart() {
  const { data } = useMyCartQuery();
  const length = data?.myCart?.totalQuantity || 0;
  if (!data?.myCart) {
    return null;
  }
  return (
    <Link href={routes.cart} passHref>
      <IconButton>
        <Badge badgeContent={length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Link>
  );
}
