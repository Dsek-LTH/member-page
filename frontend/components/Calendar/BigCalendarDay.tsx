import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function BigCalendarDay({ day }: { day: number }) {
  return (
    <Paper style={{ minWidth: '5rem', width: '5rem', height: '5rem' }}>
      <Box
        height="1.25rem"
        style={{
          borderTopRightRadius: '0.5rem',
          borderTopLeftRadius: '0.5rem',
          backgroundColor: '#f280a1',
        }}
      />
      <Box>
        <Typography textAlign="center" variant="h3">
          {day}
        </Typography>
      </Box>
    </Paper>
  );
}
