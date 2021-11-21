import React from 'react';
import { useTranslation } from 'next-i18next';
import { Table, TableBody, TableContainer, Paper } from '@mui/material';
import {
  BookingStatus,
  Member,
  useGetBookingsQuery,
} from '~/generated/graphql';
import BookingTableHead from './bookingTableHead';
import BookingTableRow from './bookingTableRow';
import { DateTime } from 'luxon';
import LoadingTable from '~/components/LoadingTable';

type BookingListProps = {
  from: DateTime;
  to: DateTime;
  status: BookingStatus;
  user?: Member;
  onChange?: () => void;
};

export default function BookingList({
  from,
  to,
  status,
  user,
  onChange,
}: BookingListProps) {
  const { data, loading } = useGetBookingsQuery({
    variables: {
      from: from,
      to: to,
      status: status,
    },
  });
  if (loading || !data?.bookingRequests) {
    return (
      <Paper>
        <LoadingTable />
      </Paper>
    );
  }

  const bookingRequests = data?.bookingRequests; //?? previousData?.bookingRequests

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <BookingTableHead user={user} />
        <TableBody>
          {bookingRequests.map((bookingItem, index) => (
            <BookingTableRow
              key={index}
              bookingRequest={bookingItem}
              user={user}
              onChange={onChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
