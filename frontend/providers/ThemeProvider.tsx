import { createMuiTheme, ThemeProvider as MaterialThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#F280A1',
    },
    secondary: {
      main: '#9966CC',
    },
  },
})

const ThemeProvider: React.FC<{}> = ({children}) => {
  return (
    <MaterialThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MaterialThemeProvider>
  )
}

export default ThemeProvider;