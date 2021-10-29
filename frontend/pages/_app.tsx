import React from 'react';
import LoginProvider from '../providers/LoginProvider';
import ThemeProvider from '../providers/ThemeProvider';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { UserProvider } from '~/providers/UserProvider';
import UserExistingCheck from '~/components/Users/UserExsistingCheck';
import '~/styles/react-big-calendar.css';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '~/apolloClient';

function MyApp({ Component, pageProps, cookies }: AppProps & { cookies: any }) {
  const client = useApollo(pageProps);
  return (
    <>
      <LoginProvider cookies={cookies}>
        <ApolloProvider client={client}>
          <ThemeProvider>
            <UserProvider>
              <UserExistingCheck>
                <Component {...pageProps} />
              </UserExistingCheck>
            </UserProvider>
          </ThemeProvider>
        </ApolloProvider>
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
