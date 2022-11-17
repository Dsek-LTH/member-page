import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function BigCalendarDay({ day, small }: { day: number, small?: boolean }) {
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
        style={{
          borderTopRightRadius: '0.5rem',
          borderTopLeftRadius: '0.5rem',
          backgroundColor: '#f280a1',
        }}
      />
      <Box>
        <Typography textAlign="center" variant={small ? 'h6' : 'h3'}>
          {day}
        </Typography>
      </Box>
    </Paper>
  );
}
