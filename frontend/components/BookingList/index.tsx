import React from 'react';
import { useTranslation } from 'next-i18next';
import { Table, TableBody, TableContainer } from '@material-ui/core';
import { BookingRequest } from '~/generated/graphql';
import BookingTableHead from './bookingTableHead';
import BookingTableRow from './bookingTableRow';

type BookingListProps = {
    bookingItems: BookingRequest[],
}

export default function BookingList({
    bookingItems
}: BookingListProps) {
    const { t } = useTranslation(['common']);

    return (
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
                <BookingTableHead />
                <TableBody>
                    {bookingItems.map( (bookingItem, index) => (
                        <BookingTableRow key={index} bookingRequest={bookingItem}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}