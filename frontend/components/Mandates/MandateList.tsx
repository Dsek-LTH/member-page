import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import groupBy from '~/functions/groupBy';
import {
  Maybe,
  Member,
  Position,
  useGetMandatesByPeriodQuery,
} from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import MandateSet from './MandateSet';
import MandateSkeleton from './MandateSkeleton';
import { mandateStyles } from './mandatestyles';

type PartialMandate = {
  position?: Partial<Position>;
  member?: Partial<Member>;
};

export default function MandateList({ year }) {
  const { t, i18n } = useTranslation('mandate');
  const apiContext = useApiAccess();

  const { data, loading, error } = useGetMandatesByPeriodQuery({
    variables: {
      page: 0,
      perPage: 100,
      start_date: new Date(year, 0, 1),
      end_date: new Date(year, 12, 31),
    },
  });

  const classes = mandateStyles();

  if (loading) {
    return <MandateSkeleton />;
  }

  if (error) {
    return <h2>Error</h2>;
  }

  const isEnglish = i18n.language === 'en';

  const mandateList = data.mandates.mandates;
  const mandatesByPosition = groupBy<string, Member, Maybe<PartialMandate>>(
    mandateList,
    (e) =>
      isEnglish && e.position.nameEn ? e.position.nameEn : e.position.name,
    (e) => e.member
  );
  const positions = Array.from(mandatesByPosition.keys()).sort((a, b) =>
    a.localeCompare(b)
  );
  if (!hasAccess(apiContext, 'core:mandate:read')) return <></>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell>{t('positions')}</TableCell>
            <TableCell>{t('mandates')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((p, i) =>
            mandatesByPosition.has(p) ? (
              <TableRow
                className={i % 2 == 1 ? classes.rowOdd : classes.rowEven}
                key={p}
              >
                <TableCell>{p}</TableCell>
                <MandateSet members={mandatesByPosition.get(p)}></MandateSet>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell>{p}</TableCell>
                <TableCell>{t('vakant')}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
