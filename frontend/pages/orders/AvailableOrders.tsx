import { Button, Stack } from '@mui/material';

const orders = ['dboll', 'kex', 'lasagne'];

function AvailableOrders({ refetch }) {
  return (
    <Stack direction="row" spacing={1} marginBottom={2}>
      {orders.map((order) => (
        <Button
          key={order}
          variant="outlined"
          onClick={() => {
            const formData = new FormData();
            formData.append('content', order);
            fetch('https://dsek-queue.herokuapp.com/api', {
              method: 'POST',
              body: formData,
            }).then(() => {
              refetch();
            });
          }}
        >
          {order}
        </Button>
      ))}
    </Stack>
  );
}

export default AvailableOrders;
