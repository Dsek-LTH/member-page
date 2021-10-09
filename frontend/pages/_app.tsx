import { useEffect } from 'react';
import GraphQLProvider from '../providers/GraphQLProvider';
import LoginProvider from '../providers/LoginProvider';
import ThemeProvider from '../providers/ThemeProvider';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { UserProvider } from '~/providers/UserProvider';
import '~/styles/react-big-calendar.css';

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
                <Component {...pageProps} />
              </UserProvider>
            </ThemeProvider>
          </CacheProvider>
        </GraphQLProvider>
      </LoginProvider>
    </>
  );
}

export default appWithTranslation(MyApp);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'header'])),
  },
});
