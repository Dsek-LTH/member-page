import React from 'react';
import { useTranslation } from 'next-i18next';
import { Link, TableCell, TableRow } from '@material-ui/core';
import { BookingRequest } from '~/generated/graphql';
import { DateTime } from 'luxon';
import routes from '~/routes';

type BookingTableRowProps = {
    bookingRequest:BookingRequest
}

export default function BookingTableRow({
bookingRequest
}: BookingTableRowProps) {
    const { t, i18n } = useTranslation(['common']);

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
                {bookingRequest.status}
            </TableCell>
            <TableCell  align="left" colSpan={3}>
                <Link href={routes.member(bookingRequest.booker.id)}>
                    {`${bookingRequest.booker.first_name} ${bookingRequest.booker.last_name}`}
                </Link>
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {DateTime.fromISO(bookingRequest.last_modified || bookingRequest.created).setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT)}
            </TableCell>
        </TableRow>
    )
}