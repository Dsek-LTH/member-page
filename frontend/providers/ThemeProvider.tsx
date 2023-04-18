import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
  ThemeOptions,
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
import { useRouter } from 'next/router';
import isServer from '~/functions/isServer';

const ColorModeContext = createContext({ toggleColorMode: () => {}, reloadTheme: () => {} });

export function useColorMode() {
  const state = useContext(ColorModeContext);
  if (state === undefined) {
    // eslint-disable-next-line no-console
    console.error('useColorMode must be used within ThemeProvider');
  }
  return state;
}

const defaultTheme: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  shape: {
    borderRadius: 10,
  },
  palette: {
    primary: {
      main: '#F280A1',
      light: 'rgba(242,128,161,0.1)',
    },
    secondary: {
      main: '#9966CC',
    },
    mode: 'dark',
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

const localStoragePref = isServer ? 'dark' : localStorage.getItem('mode'); // dark makes sense as a default

function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>('dark');
  const [themeReloaded, setThemeReloaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStoragePref) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    } else {
      setMode(localStoragePref as PaletteMode);
    }
  }, [prefersDarkMode]);

  // This is here as to always do it on page load even if LanguageSelector is not rendered
  useEffect(() => {
    const savedLocale = window.localStorage.getItem('locale');
    if (savedLocale && !window.location.href.includes(`/${savedLocale}`)) {
      if (router.pathname !== '/404') {
        router.push(router.asPath, null, { locale: savedLocale });
      } else {
        window.location.href = `/${savedLocale}${router.asPath}`;
      }
    }
  // If we include "router" in deps, it causes an infinite loop
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('mode', newMode);
          return newMode;
        });
      },
      /**
       * This is a hack to force a reload of the theme.
       * This is needed because Chonky uses material-ui 3
       */
      reloadTheme: () => {
        setThemeReloaded(!themeReloaded);
      },
    }),
    [themeReloaded],
  );

  const theme = useMemo(() => {
    const mergedTheme: ThemeOptions = {
      ...defaultTheme,
      palette: { ...defaultTheme.palette, mode },
    };
    return createTheme(mergedTheme);
  }, [mode, themeReloaded]); // eslint-disable-line react-hooks/exhaustive-deps
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
