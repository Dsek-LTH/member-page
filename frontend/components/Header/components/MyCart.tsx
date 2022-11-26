import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMyCartQuery } from '~/generated/graphql';
import routes from '~/routes';

// time diff in milliseconds
const timeDiff = (date1: Date, date2: Date) => {
  const diff = date2.getTime() - date1.getTime();
  return diff;
};

// milliseconds to minutes and seconds
const msToTime = (duration: number) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes}m ${seconds}s`;
};

export default function MyCart() {
  const { data, refetch } = useMyCartQuery();
  // remaining time in ms
  const [timeLeft, setTimeLeft] = useState(1000 * 60 * 60);
  const length = data?.myCart?.totalQuantity || 0;
  useEffect(() => {
    setTimeLeft(timeDiff(new Date(), new Date(data?.myCart?.expiresAt)));
    let interval;
    if (data?.myCart) {
      // update timeleft every second
      interval = setInterval(() => {
        setTimeLeft(timeDiff(new Date(), new Date(data?.myCart?.expiresAt)));
      }, 1000);
      const msRemaining = timeDiff(new Date(data.myCart.expiresAt), new Date());
      setTimeout(() => {
        refetch();
      }, msRemaining);
    }
    return () => clearInterval(interval);
  }, [data]);

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
        <span>{msToTime(timeLeft)}</span>
      )}
    </>
  );
}
