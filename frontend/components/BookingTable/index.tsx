/* eslint-disable no-nested-ternary */
import {
  Paper, Table, TableBody, TableContainer,
} from '@mui/material';
import { useRouter } from 'next/router';
import LoadingTable from '~/components/LoadingTable';
import
{
  GetBookingsQuery,
} from '~/generated/graphql';
import BookingTableHead from './bookingTableHead';
import BookingTableRow from './bookingTableRow';

type BookingListProps = {
  data: GetBookingsQuery
  refetch: () => void
  loading: boolean
};

export default function BookingList({
  data,
  refetch,
  loading,
}: BookingListProps) {
  const router = useRouter();
  const selectedBookingElement = router.query.booking
    ? (Array.isArray(router.query.booking)
      ? router.query.booking[0]
      : router.query.booking)
    : undefined;

  if (loading || !data?.bookingRequests) {
    return (
      <Paper>
        <LoadingTable />
      </Paper>
    );
  }

  const bookingRequests = data?.bookingRequests; // ?? previousData?.bookingRequests

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <BookingTableHead />
        <TableBody>
          {bookingRequests.map((bookingItem) => (
            <BookingTableRow
              isSelected={selectedBookingElement === bookingItem.id}
              key={bookingItem.id}
              bookingRequest={bookingItem}
              otherBookingRequests={[...bookingRequests].filter((br) => br.id !== bookingItem.id)}
              onChange={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
