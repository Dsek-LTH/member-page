import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PaletteMode, useMediaQuery } from '@mui/material';
import isServer from '~/functions/isServer';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  const state = useContext(ColorModeContext);
  if (state === undefined) {
    // eslint-disable-next-line no-console
    console.error('useColorMode must be used within ThemeProvider');
  }
  return state;
}

const defaultTheme = {
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
      light: 'rgba(242,128,161,0.1)',
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
        },
      },
    },
  },
};

const localStoragePref = isServer ? 'light' : localStorage.getItem('mode');

function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    if (!localStoragePref) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    } else {
      setMode(localStoragePref as PaletteMode);
    }
  }, [prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('mode', newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(() => {
    const mergedTheme = {
      ...defaultTheme,
      palette: { ...defaultTheme.palette, mode },
    };
    return createTheme(mergedTheme);
  }, [mode]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <MaterialThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MaterialThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default ThemeProvider;
