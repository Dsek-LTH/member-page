import { ThemeOptions } from '@mui/material';

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: 'hsl(317, 82%, 56%)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
};

export default theme;
