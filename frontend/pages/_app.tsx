import React, { useEffect } from 'react';
import GraphQLProvider from '../providers/GraphQLProvider';
import LoginProvider from '../providers/LoginProvider';
import ThemeProvider from '../providers/ThemeProvider';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { UserProvider } from '~/providers/UserProvider';
import { ApiAccessProvider } from '~/providers/ApiAccessProvider';
import UserExistingCheck from '~/components/Users/UserExsistingCheck';
import '~/styles/react-big-calendar.css';
import Layout from '~/lib/layout';

function MyApp({ Component, pageProps, cookies }: AppProps & { cookies: any }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <LoginProvider cookies={cookies}>
        <GraphQLProvider>
          <ThemeProvider>
            <UserProvider>
              <UserExistingCheck>
                <ApiAccessProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </ApiAccessProvider>
              </UserExistingCheck>
            </UserProvider>
          </ThemeProvider>
        </GraphQLProvider>
      </LoginProvider>
    </>
  );
}

export default appWithTranslation(MyApp);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'header', 'member'])),
  },
});
