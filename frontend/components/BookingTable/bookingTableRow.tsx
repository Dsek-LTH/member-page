import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Badge, Link, TableCell, TableRow, useTheme,
} from '@mui/material';
import { DateTime } from 'luxon';
import { BookingStatus, GetBookingsQuery } from '~/generated/graphql';
import routes from '~/routes';
import BookingTableModifedStatusCell from './bookingTableModifedStatusCell';
import fromIsoToShortDate from '~/functions/fromIsoToShortDate';
import { getFullName } from '~/functions/memberFunctions';

type BookingRequest = GetBookingsQuery['bookingRequests'][number];

type BookingTableRowProps = {
  bookingRequest: BookingRequest;
  otherBookingRequests: BookingRequest[];
  onChange?: () => void;
  isSelected?: boolean;
};

const now = DateTime.now();

const getStatusColor = (bookingRequest: BookingRequest, otherBookingRequests: BookingRequest[]): 'success' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'warning' => {
  const start = DateTime.fromISO(bookingRequest.start);
  const end = DateTime.fromISO(bookingRequest.end);
  const conflict = otherBookingRequests
    .some((br) =>
      DateTime.fromISO(br.start) < end
      && start < DateTime.fromISO(br.end)
      && br.what.some((ba) => bookingRequest.what.map((ba2) => ba2.id).includes(ba.id)));
  if (conflict) {
    if (bookingRequest.status === BookingStatus.Pending) {
      return 'error';
    }
    if (bookingRequest.status === BookingStatus.Accepted) {
      return 'warning';
    }
  }
  if (now > start && now < end && bookingRequest.status === BookingStatus.Accepted) {
    return 'success';
  }
  if (bookingRequest.status === BookingStatus.Accepted) {
    return 'primary';
  }
  if (bookingRequest.status === BookingStatus.Denied) {
    return 'secondary';
  }
  return 'info';
};

function BookingTableRow({
  bookingRequest,
  otherBookingRequests,
  onChange,
  isSelected,
}: BookingTableRowProps) {
  const { t, i18n } = useTranslation(['common', 'booking']);
  const english = i18n.language === 'en';
  const ref = useRef<HTMLTableRowElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [ref, isSelected]);

  return (
    <TableRow
      ref={ref}
      sx={{ backgroundColor: isSelected ? theme.palette.secondary.main : undefined }}
    >
      <TableCell align="left" colSpan={3}>
        {fromIsoToShortDate(bookingRequest.start, i18n.language)}
        {' '}
        (
        {DateTime.fromISO(bookingRequest.start).setLocale(i18n.language).weekdayLong}
        )
      </TableCell>
      <TableCell align="left" colSpan={3}>
        {fromIsoToShortDate(bookingRequest.end, i18n.language)}
      </TableCell>
      <TableCell align="left" colSpan={3}>
        {bookingRequest.event}
      </TableCell>
      <TableCell align="left" colSpan={3}>
        {bookingRequest.what.map((bookable) => (english ? bookable.name_en : bookable.name)).join(', ')}
      </TableCell>
      <TableCell align="left" colSpan={3}>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color={getStatusColor(bookingRequest, otherBookingRequests)} variant="dot" style={{ marginRight: '1rem' }} />
          {t(`booking:${bookingRequest.status}`)}
        </div>
      </TableCell>
      <TableCell align="left" colSpan={3}>
        <Link href={routes.member(bookingRequest.booker.student_id)}>
          {getFullName(bookingRequest.booker)}
        </Link>
      </TableCell>
      <TableCell align="left" colSpan={3}>
        {fromIsoToShortDate(
          bookingRequest.last_modified || bookingRequest.created,
          i18n.language,
        )}
      </TableCell>
      <BookingTableModifedStatusCell
        onStatusChange={onChange}
        bookerId={bookingRequest.booker.id}
        bookingId={bookingRequest.id}
        status={bookingRequest.status}
        align="left"
        colSpan={3}
      />
    </TableRow>
  );
}

export default BookingTableRow;
