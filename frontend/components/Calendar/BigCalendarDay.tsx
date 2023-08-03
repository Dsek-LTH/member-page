import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DateTime } from 'luxon';

export default function BigCalendarDay({
  day,
  month,
  small,
}: {
  day: number,
  month?: number,
  small?: boolean
}) {
  const monthName = month ? DateTime.fromFormat(`2000-${month}-${day}`, 'yyyy-M-d').monthShort : '';
  return (
    <Paper style={{
      borderTopRightRadius: '0.5rem',
      borderTopLeftRadius: '0.5rem',
      minWidth: small ? '2.5rem' : '5rem',
      width: small ? '2.5rem' : '5rem',
      height: small ? '2.5rem' : '5rem',
    }}
    >
      <Box
        height={small ? '0.6rem' : '1.25rem'}
        sx={{
          borderTopRightRadius: '0.5rem',
          borderTopLeftRadius: '0.5rem',
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          textTransform: 'capitalize',
          fontSize: small ? '0.5rem' : '0.8rem',
        }}
      >
        {monthName}
      </Box>
      <Box>
        <Typography textAlign="center" variant={small ? 'h6' : 'h3'}>
          {day}
        </Typography>
      </Box>
    </Paper>
  );
}
