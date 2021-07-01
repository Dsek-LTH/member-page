import React from 'react';
import { useTranslation } from 'next-i18next';
import { TableCell, TableRow } from '@material-ui/core';

export default function LoadingTableRow() {
    const { t } = useTranslation(['common']);

    return (
        <TableRow>
            <TableCell align="left" colSpan={3}>
                {t('loading...')}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {t('loading...')}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {t('loading...')}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {t('loading...')}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {t('loading...')}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {t('loading...')}
            </TableCell>
            <TableCell align="left" colSpan={3}>
                {t('loading...')}
            </TableCell>
        </TableRow>
    )
}