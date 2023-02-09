import React, { useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ThemeProvider from '../providers/ThemeProvider';
import LoginProvider from '../providers/LoginProvider';
import { UserProvider } from '~/providers/UserProvider';
import { ApiAccessProvider } from '~/providers/ApiAccessProvider';
import '~/styles/react-big-calendar.css';
import '~/styles/globals.css';
import Layout from '~/components/Layout';
import { SnackbarProvider } from '~/providers/SnackbarProvider';
import { DialogProvider } from '~/providers/DialogProvider';

function MyApp({ Component, pageProps: { session, ...pageProps } }:
AppProps & { Component: any, pageProps: any }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const isTV = Component?.tv;

  return (
    <LoginProvider session={session} apolloCache={pageProps.apolloCache}>
      <ThemeProvider>
        <UserProvider>
          <ApiAccessProvider>
            <SnackbarProvider>
              <DialogProvider>
                {!isTV && (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
                )}
                {isTV && (
                <Component {...pageProps} />
                )}
              </DialogProvider>
            </SnackbarProvider>
          </ApiAccessProvider>
        </UserProvider>
      </ThemeProvider>
    </LoginProvider>
  );
}

export default appWithTranslation(MyApp);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'header', 'member'])),
  },
});
