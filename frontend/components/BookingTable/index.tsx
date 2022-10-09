import React from 'react';
import {
  Table, TableBody, TableContainer, Paper,
} from '@mui/material';
import {
  GetBookingsQuery,
  MeHeaderQuery,
} from '~/generated/graphql';
import BookingTableHead from './bookingTableHead';
import BookingTableRow from './bookingTableRow';
import LoadingTable from '~/components/LoadingTable';

type BookingListProps = {
  data: GetBookingsQuery
  refetch: () => void
  loading: boolean
  user?: MeHeaderQuery['me'];
};

export default function BookingList({
  data,
  refetch,
  loading,
  user,
}: BookingListProps) {
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
        <BookingTableHead user={user} />
        <TableBody>
          {bookingRequests.map((bookingItem) => (
            <BookingTableRow
              key={bookingItem.id}
              bookingRequest={bookingItem}
              onChange={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
