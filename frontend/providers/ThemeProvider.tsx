import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: '#F280A1',
    },
    secondary: {
      main: '#9966CC',
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: 'inherit',
        },
      },
    },
  },
});

const ThemeProvider: React.FC<{}> = ({ children }) => {
  return (
    <MaterialThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MaterialThemeProvider>
  );
};

export default ThemeProvider;
