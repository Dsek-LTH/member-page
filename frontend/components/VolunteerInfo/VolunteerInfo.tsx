import { Stack, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import React from 'react';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import Link from '~/components/Link';
import routes from '~/routes';

export default function VolunteerInfo({ name }) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Stack sx={{ marginTop: { xs: '1rem', md: 0 } }} direction="row" alignItems="center" spacing={2}>
        <Link href={routes.mandateByYear(DateTime.now().year)}>
          <ArrowBackIosNewIcon fontSize="large" style={{ marginTop: '0.5rem' }} />
        </Link>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' } }}
        >
          {t(`mandate:${name}`)}
        </Typography>
      </Stack>
    </Stack>
  );
}
