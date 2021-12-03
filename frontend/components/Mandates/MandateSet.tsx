import { Link, TableCell } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import routes from '~/routes';
import { mandateStyles } from './mandatestyles';

export default function MandateSet({ members }) {
  const { t, i18n } = useTranslation('mandate');
  const classes = mandateStyles();

  members.sort((a, b) => a.last_name.localeCompare(b.last_name));

  return (
    <TableCell align="left">
      {members.map((m) =>
        m ? (
          <Link href={routes.member(m.id)} key={m.id}>
            <p>
              {m.first_name} {m.last_name}
            </p>
          </Link>
        ) : (
          <div>{t('memberError')}</div>
        )
      )}
    </TableCell>
  );
}
