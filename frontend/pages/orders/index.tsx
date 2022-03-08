import { Stack, Container } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import useInterval from '~/functions/useInterval';
import AvailableOrders from './AvailableOrders';
import Order from './Order';

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

  useInterval(() => {
    fetchAllOrders();
  }, 1000);

  return (
    <Container style={{ padding: '5rem' }}>
      <AvailableOrders refetch={fetchAllOrders} />

      <h1>Färdigt</h1>
      <Stack direction="row" flexWrap="wrap" minHeight="11rem">
        {finishedOrders.map((order) => (
          <Order key={order.id} order={order} fetchAllData={fetchAllOrders} />
        ))}
      </Stack>

      <h1>Tillagas</h1>
      <Stack direction="row" flexWrap="wrap">
        {unfinishedOrders.map((order) => (
          <Order key={order.id} order={order} fetchAllData={fetchAllOrders} />
        ))}
      </Stack>
    </Container>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'header', 'member'])),
  },
});
