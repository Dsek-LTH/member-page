import React from 'react';
import { useTranslation } from 'next-i18next';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { TableCell, TableHead, TableRow } from '@mui/material';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

export default function BookingTableHead() {
  const { t } = useTranslation(['common', 'booking']);
  const apiContext = useApiAccess();

  return (
    <TableHead>
      <TableRow>
        <TableCell align="left" colSpan={3}>
          {t('booking:start')}
        </TableCell>
        <TableCell align="left" colSpan={3}>
          {t('booking:end')}
        </TableCell>
        <TableCell align="left" colSpan={3}>
          {t('booking:event')}
        </TableCell>
        <TableCell align="left" colSpan={3}>
          {t('booking:what')}
        </TableCell>
        <TableCell align="left" colSpan={3}>
          {t('booking:status')}
        </TableCell>
        <TableCell align="left" colSpan={3}>
          {t('booking:responsiblePerson')}
        </TableCell>
        <TableCell align="left" colSpan={3}>
          {t('booking:lastModified')}
        </TableCell>
        {
          /* Whoever can edit the status on bookings */
          hasAccess(apiContext, 'booking_request:update') && (
            <TableCell align="left" colSpan={3}>
              {t('booking:changeStatus')}
            </TableCell>
          )
        }
      </TableRow>
    </TableHead>
  );
}
