import { Link, TableCell } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import routes from '~/routes';
import { Member } from '~/generated/graphql';

export default function MandateSet({ members }: { members: Member[] }) {
  const { t } = useTranslation('mandate');

  members.sort((a, b) => a.last_name.localeCompare(b.last_name));

  return (
    <TableCell align="left">
      {members.map((m) =>
        (m ? (
          <Link href={routes.member(m.id)} key={m.id}>
            <p>
              {m.first_name}
              {' '}
              {m.last_name}
            </p>
          </Link>
        ) : (
          <div>{t('memberError')}</div>
        )))}
    </TableCell>
  );
}
