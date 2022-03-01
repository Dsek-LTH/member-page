import { Avatar, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import Order from '~/components/Orders/Order';

const OrderPaper = styled(Paper)`
  min-width: 10rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 32px;
  cursor: pointer;
`;

export default function OrdersPage() {
  const [unfinishedOrders, setUnfinishedOrders] = useState([]);
  const [finishedOrders, setFinishedOrders] = useState([]);

  const fetchAllOrders = () => {
    fetch('https://dsek-queue.herokuapp.com/api')
      .then((response) => response.json())
      .then((responseData) => {
        setUnfinishedOrders(responseData.filter((order) => !order.isDone));
        setFinishedOrders(responseData.filter((order) => order.isDone));
      });
  };

  const markAsDone = (id: number) => {
    fetch(`https://dsek-queue.herokuapp.com/api/${id}/done`, {
      method: 'PUT',
    }).then(() => {
      fetchAllOrders();
    });
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <Stack>
      <Typography variant='h2'>Klart</Typography>
      <Stack direction='row' flexWrap='wrap'>
        {finishedOrders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </Stack>
      <Typography variant='h2'>Inte klart</Typography>
      <Stack direction='row' flexWrap='wrap'>
        {unfinishedOrders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </Stack>
    </Stack>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'header', 'member'])),
  },
});
