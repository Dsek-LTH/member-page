/* eslint-disable no-nested-ternary */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import
{
  Box,
  Button,
  Paper, Table, TableBody,
  TableContainer,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
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
    <Box>
      <TableContainer sx={{ maxHeight: isExpanded ? 1000 : 520, transition: 'max-height 0.2s' }}>
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
      <Button
        onClick={() => setIsExpanded((curr) => !curr)}
        sx={{
          width: '100%', height: 40, borderTopLeftRadius: 0, borderTopRightRadius: 0,
        }}
      >
        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Button>
    </Box>
  );
}
