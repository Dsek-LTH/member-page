import { Paper, Stack } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)`
  cursor: pointer;
  min-width: 10rem;
  min-height: 10rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

const onClick = (order) => {
  if (order.isDone) {
    return fetch(`https://dsek-queue.herokuapp.com/api/${order.id}`, {
      method: 'DELETE',
    });
  } else {
    return fetch(`https://dsek-queue.herokuapp.com/api/${order.id}/done`, {
      method: 'PUT',
    });
  }
};

const Order = ({ order, fetchAllData }) => {
  return (
    <StyledPaper
      onClick={() => {
        onClick(order).then(() => {
          fetchAllData();
        });
      }}
    >
      <Stack alignItems="center" justifyContent="center">
        <h1>{order.id}</h1>
        {order.content}
      </Stack>
    </StyledPaper>
  );
};

export default Order;
