import { useEffect } from 'react';
import GraphQLProvider from '../providers/GraphQLProvider';
import LoginProvider from '../providers/LoginProvider';
import ThemeProvider from '../providers/ThemeProvider';
import { CacheProvider } from '@emotion/react';
import Header from '../components/Header';
import createCache from '@emotion/cache';
import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import Head from 'next/head'

export const cache = createCache({ key: 'css', prepend: true });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    base: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100%',
    }
  })
)

function MyApp({ Component, pageProps, cookies }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  const classes = useStyles();
  return (
    <>
    <Head>
      <title>D-sektionen</title>
    </Head>
    <LoginProvider cookies={cookies}>
      <GraphQLProvider>
        <CacheProvider value={cache}>
          <ThemeProvider>
            <Box className={classes.base}>
              <Header/>
              <Component {...pageProps} />
            </Box>
          </ThemeProvider>
        </CacheProvider>
      </GraphQLProvider>
    </LoginProvider>
    </>
  )
}

export default MyApp
