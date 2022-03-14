import { Paper, Stack } from '@mui/material';
import { styled } from '@mui/system';
import { useKeycloak } from '@react-keycloak/ssr';
import { setOrderDone, deleteOrder } from '~/functions/ordersApi';

const StyledPaper = styled(Paper)`
  cursor: pointer;
  min-width: 10rem;
  min-height: 10rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

function Order({ order, fetchAllData }) {
  const { keycloak } = useKeycloak();
  return (
    <StyledPaper
      onClick={() => {
        if (keycloak.token) {
          if (order.isDone) {
            deleteOrder(order.id, keycloak.token).then(() => {
              fetchAllData();
            });
          } else {
            setOrderDone(order.id, keycloak.token).then(() => {
              fetchAllData();
            });
          }
        } else {
          window.alert('You have to be logged in!');
        }
      }}
    >
      <Stack alignItems="center" justifyContent="center">
        <h1>{order.id}</h1>
        {`[${order.orders.join(', ')}]`}
      </Stack>
    </StyledPaper>
  );
}

export default Order;
