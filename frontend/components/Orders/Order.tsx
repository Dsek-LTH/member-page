import { Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';

const OrderPaper = styled(Paper)`
  min-width: 10rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 32px;
  cursor: pointer;
`;

export default function Order({ order }) {
  return (
    <OrderPaper key={order.id}>
      <Stack justifyContent='center' alignItems='center'>
        <Typography fontSize={48}>{order.id}</Typography>
        <Typography fontSize={12}>{order.content}</Typography>
      </Stack>
    </OrderPaper>
  );
}
