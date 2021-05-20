import React from 'react';
import { useTranslation } from 'next-i18next';
import "react-mde/lib/styles/css/react-mde-all.css";
import { TableCell, TableHead, TableRow } from '@material-ui/core';

type BookingTableHeadProps = {

}

export default function BookingTableHead({

}: BookingTableHeadProps) {
    const { t } = useTranslation(['common']);

    return (
          <TableHead>
            <TableRow>
              <TableCell align="left" colSpan={3}>
                Start
              </TableCell>
              <TableCell align="left" colSpan={3}>
                Slut
              </TableCell>
              <TableCell align="left" colSpan={3}>
                Evenemang
              </TableCell>
              <TableCell align="left" colSpan={3}>
                Vad
              </TableCell>
              <TableCell align="left" colSpan={3}>
                Status
              </TableCell>
              <TableCell align="left" colSpan={3}>
                Ansvarig person
              </TableCell>
              <TableCell align="left" colSpan={3}>
                Senast ändrad
              </TableCell>
            </TableRow>
          </TableHead>
    )
}