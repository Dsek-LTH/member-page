import React from 'react';
import { useTranslation } from 'next-i18next';
import { TableCell, TableHead, TableRow } from '@mui/material';

export default function BookingTableHead() {
  const { t } = useTranslation(['common', 'booking']);

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
        <TableCell align="left" colSpan={3}>
          {t('booking:changeStatus')}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
