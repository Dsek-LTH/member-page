import React from 'react';
import { useTranslation } from 'next-i18next';
import { Link, TableCell, TableRow } from '@material-ui/core';
import { BookingRequest, Member } from '~/generated/graphql';
import { DateTime } from 'luxon';
import routes from '~/routes';
import BookingTableModifedStatusCell from './bookingTableModifedStatusCell';

type BookingTableRowProps = {
    bookingRequest: BookingRequest
    user?: Member,
    onChange?: () => void
}


export default function BookingTableRow({
    bookingRequest,
    user,
    onChange
}: BookingTableRowProps) {
    const { t, i18n } = useTranslation(['common','booking']);

    return (
        <TableRow>
            <TableCell align="left" colSpan={3}>
                {DateTime.fromISO(bookingRequest.start).setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT)}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {DateTime.fromISO(bookingRequest.end).setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT)}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {bookingRequest.event}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {bookingRequest.what}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {t(`booking:${bookingRequest.status}`)}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                <Link href={routes.member(bookingRequest.booker.id)}>
                    {`${bookingRequest.booker.first_name} ${bookingRequest.booker.last_name}`}
                </Link>
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {DateTime.fromISO(bookingRequest.last_modified || bookingRequest.created).setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT)}
            </TableCell>

            {
                /* Whoever can edit the status on bookings*/
                user &&
                <BookingTableModifedStatusCell
                    onStatusChange={onChange}
                    bookingId={bookingRequest.id}
                    status={bookingRequest.status}
                    align="left"
                    colSpan={3}
                />
            }

        </TableRow>
    )
}