import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMyCartQuery } from '~/generated/graphql';
import routes from '~/routes';

// time diff in milliseconds
const timeDiff = (date1: Date, date2: Date) => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
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
  const [timeLeft, setTimeLeft] = useState('');
  const length = data?.myCart?.totalQuantity || 0;
  useEffect(() => {
    setTimeLeft(msToTime(timeDiff(new Date(), new Date(data?.myCart?.expiresAt))));
    let interval;
    if (data?.myCart) {
      // update timeleft every second
      interval = setInterval(() => {
        setTimeLeft(msToTime(timeDiff(new Date(), new Date(data?.myCart?.expiresAt))));
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
      <span>{timeLeft}</span>
    </>
  );
}
