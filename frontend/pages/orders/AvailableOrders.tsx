import { Button, Stack } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { postOrder } from '~/functions/ordersApi';

const orders = ['dboll', 'kex', 'lasagne'];

function AvailableOrders({ refetch }) {
  const { keycloak } = useKeycloak();
  return (
    <Stack direction="row" spacing={1} marginBottom={2}>
      {orders.map((order) => (
        <Button
          key={order}
          variant="outlined"
          onClick={() => {
            if (keycloak.token) {
              postOrder([order], keycloak.token).then(() => {
                refetch();
              });
            } else {
              window.alert('Du måste vara inloggad!');
            }
          }}
        >
          {order}
        </Button>
      ))}
    </Stack>
  );
}

export default AvailableOrders;
