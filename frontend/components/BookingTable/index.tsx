import React from 'react';
import {
  Table, TableBody, TableContainer, Paper,
} from '@mui/material';
import { DateTime } from 'luxon';
import {
  BookingStatus,
  useGetBookingsQuery,
} from '~/generated/graphql';
import BookingTableHead from './bookingTableHead';
import BookingTableRow from './bookingTableRow';
import LoadingTable from '~/components/LoadingTable';

type BookingListProps = {
  from: DateTime;
  to: DateTime;
  status: BookingStatus;
  onChange?: () => void;
};

export default function BookingList({
  from,
  to,
  status,
  onChange,
}: BookingListProps) {
  const { data, loading } = useGetBookingsQuery({
    variables: {
      from,
      to,
      status,
    },
  });
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
              key={bookingItem.id}
              bookingRequest={bookingItem}
              onChange={onChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
