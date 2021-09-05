import React from 'react';
import { useTranslation } from 'next-i18next';
import { Link, TableCell, TableRow } from '@material-ui/core';
import { BookingRequest, Member } from '~/generated/graphql';
import routes from '~/routes';
import BookingTableModifedStatusCell from './bookingTableModifedStatusCell';
import fromIsoToShortDate from '~/functions/fromIsoToShortDate';

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
                {fromIsoToShortDate(bookingRequest.start, i18n.language)}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {fromIsoToShortDate(bookingRequest.end, i18n.language)}
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
                {fromIsoToShortDate(bookingRequest.last_modified || bookingRequest.created, i18n.language)}
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