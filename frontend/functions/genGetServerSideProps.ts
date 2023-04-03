import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Generates a function to be used as getServerSideProps or getStaticProps.
 *
 * If you need a custom getServerSideProps or getStaticProps, you can call this function twice,
 * once with the translations you need for the page, and once with the "locale" object,
 * and spread the result in your return statement.
 *
 * @example
 * export const getServerSideProps = genGetProps(['common', 'page1', 'page2'])
 * @example
 * export const getStaticProps = async ({ locale }) => ({
 *   props: {
 *     ...(await genGetProps(['common', 'page1', 'page2'])({ locale })),
 *     revalidate: 60,
 *   }
 * })
 *
 * @param translations - An array of translations to be loaded for a page,
 *  "common" does not need to be specified
 */
const genGetProps = (translations?: string[]) => async ({ locale }) => ({
  props: {
    isNativeApp: process.env.SERVE_NATIVE_APP === 'true',
    ...(await serverSideTranslations(locale, ['common', ...(translations ?? [])])),
  },
});

export default genGetProps;
