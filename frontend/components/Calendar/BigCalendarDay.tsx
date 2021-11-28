import { Box, Paper, Typography } from '@mui/material';

export default function BigCalendarDay({ day }: { day: number }) {
  return (
    <Paper style={{ width: '5rem', height: '5rem' }}>
      <Box
        height="1.25rem"
        style={{
          borderTopRightRadius: '0.5rem',
          borderTopLeftRadius: '0.5rem',
          backgroundColor: '#f280a1',
        }}
      ></Box>
      <Box>
        <Typography textAlign="center" variant="h3">
          {day}
        </Typography>
      </Box>
    </Paper>
  );
}
