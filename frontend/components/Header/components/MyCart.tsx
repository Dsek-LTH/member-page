import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useMyCartQuery } from '~/generated/graphql';
import routes from '~/routes';
import useTimeLeft from '~/hooks/useTimeLeft';

export default function MyCart() {
  const { data, refetch } = useMyCartQuery();
  const [timeLeft, minuteSecondsLeft] = useTimeLeft(data?.myCart?.expiresAt, refetch);
  const length = data?.myCart?.totalQuantity || 0;

  if (!data?.myCart) {
    return null;
  }
  return (
    <>
      <Link href={routes.cart} passHref>
        <IconButton>
          <Badge badgeContent={length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Link>
      {/* less than 5 minutes left */}
      {timeLeft < 1000 * 60 * 5 && (
        <span>{minuteSecondsLeft}</span>
      )}
    </>
  );
}
