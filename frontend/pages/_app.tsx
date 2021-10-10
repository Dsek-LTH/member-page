import React, { useContext, useEffect } from 'react';
import GraphQLProvider from '../providers/GraphQLProvider';
import LoginProvider from '../providers/LoginProvider';
import ThemeProvider from '../providers/ThemeProvider';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { appWithTranslation } from 'next-i18next'
import { AppProps } from 'next/app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import UserContext, { UserProvider } from '~/providers/UserProvider';
import UserExistingCheck from '~/components/Users/UserExsistingCheck';

export const cache = createCache({ key: 'css', prepend: true });

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
          <CacheProvider value={cache}>
            <ThemeProvider>
              <UserProvider>
                <UserExistingCheck>
                  <Component {...pageProps} />
                </UserExistingCheck>
              </UserProvider>
            </ThemeProvider>
          </CacheProvider>
        </GraphQLProvider>
      </LoginProvider>
    </>
  )
}

export default appWithTranslation(MyApp)

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'header', 'member']),
  },
})
