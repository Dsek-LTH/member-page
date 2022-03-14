import { Stack, Container } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import { fetchAllOrders, IOrder } from '~/functions/ordersApi';
import useInterval from '~/functions/useInterval';
import AvailableOrders from './AvailableOrders';
import Order from './Order';

export default function OrdersPage() {
  const [unfinishedOrders, setUnfinishedOrders] = useState<IOrder[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<IOrder[]>([]);

  const updateOrders = () => {
    fetchAllOrders().then((data) => {
      setUnfinishedOrders(data.unfinishedOrders);
      setFinishedOrders(data.finishedOrders);
    });
  };

  useEffect(() => {
    updateOrders();
  }, []);
  /*
  useInterval(() => {
    fetchAllOrders().then((data) => {
      setUnfinishedOrders(data.unfinishedOrders);
      setFinishedOrders(data.finishedOrders);
    });
  }, 2000);
  */

  return (
    <Container style={{ padding: '5rem' }}>
      <AvailableOrders refetch={updateOrders} />

      <h1>Färdigt</h1>
      <Stack direction="row" flexWrap="wrap" minHeight="11rem">
        {finishedOrders.map((order) => (
          <Order key={order.id} order={order} fetchAllData={updateOrders} />
        ))}
      </Stack>

      <h1>Tillagas</h1>
      <Stack direction="row" flexWrap="wrap">
        {unfinishedOrders.map((order) => (
          <Order key={order.id} order={order} fetchAllData={updateOrders} />
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
