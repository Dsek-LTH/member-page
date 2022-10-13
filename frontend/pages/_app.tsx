import React, { useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ThemeProvider from '../providers/ThemeProvider';
import LoginProvider from '../providers/LoginProvider';
import { UserProvider } from '~/providers/UserProvider';
import { ApiAccessProvider } from '~/providers/ApiAccessProvider';
import '~/styles/react-big-calendar.css';
import '~/styles/markdown.css';
import Layout from '~/components/layout';
import { SnackbarProvider } from '~/providers/SnackbarProvider';

function MyApp({ Component, pageProps, cookies }: {Component: any, pageProps: any, cookies: any}) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const isTV = Component?.tv;

  return (
    <LoginProvider cookies={cookies}>
      <ThemeProvider>
        <UserProvider>
          <ApiAccessProvider>
            <SnackbarProvider>
              {!isTV && (
              <Layout>
                <Component {...pageProps} />
              </Layout>
              )}
              {isTV && (
                <Component {...pageProps} />
              )}

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
