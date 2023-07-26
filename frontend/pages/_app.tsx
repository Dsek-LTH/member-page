import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import Head from 'next/head';
import DefaultLayout from '~/components/Layout';
import { ApiAccessProvider } from '~/providers/ApiAccessProvider';
import { DialogProvider } from '~/providers/DialogProvider';
import { NativeAppProvider } from '~/providers/NativeAppProvider';
import { SnackbarProvider } from '~/providers/SnackbarProvider';
import { UserProvider } from '~/providers/UserProvider';
import '~/styles/globals.css';
import '~/styles/react-big-calendar.css';
import LoginProvider from '~/providers/LoginProvider';
import ThemeProvider from '~/providers/ThemeProvider';
import { PageNameProvider } from '~/providers/PageNameProvider';

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

  const Layout = Component.getLayout || DefaultLayout;

  return (
    <>
      <Head>
        {pageProps.isNativeApp && <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />}
      </Head>
      <LoginProvider session={session}>
        <NativeAppProvider isNativeApp={pageProps.isNativeApp}>
          <ThemeProvider>
            <PageNameProvider>
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
            </PageNameProvider>
          </ThemeProvider>
        </NativeAppProvider>
      </LoginProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
