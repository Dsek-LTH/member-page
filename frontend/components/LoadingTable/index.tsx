import React from 'react';
import { Table, TableBody, TableContainer } from '@mui/material';
import BookingTableHead from '../BookingTable/bookingTableHead';
import LoadingTableRow from './LoadingTableRow';

export default function LoadingTable() {
  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <BookingTableHead />
        <TableBody>
          <LoadingTableRow />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
