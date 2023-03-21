import { Button, TableCell, TableRow } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import { Bookable } from '~/generated/graphql';
import routes from '../../routes';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

type Props = {
  bookable: Bookable;
};

export default function BookableRow({ bookable }: Props) {
  const apiContext = useApiAccess();
  return (
    <TableRow>
      <TableCell>{bookable.name}</TableCell>
      <TableCell>{bookable.name_en}</TableCell>
      <TableCell>{bookable.door?.name || '-'}</TableCell>
      <TableCell>{bookable.isDisabled ? 'Yes' : ''}</TableCell>
      {hasAccess(apiContext, 'booking_request:bookable:update') && <TableCell><Link href={routes.editBookable(bookable.id)}><Button size="small" sx={{ p: 0 }}>Edit</Button></Link></TableCell>}
    </TableRow>
  );
}
