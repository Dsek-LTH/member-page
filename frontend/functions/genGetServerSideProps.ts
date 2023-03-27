import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const genGetProps = (translations?: string[]) => async ({ locale }) => {
  return ({
  props: {
    isNativeApp: process.env.SERVE_NATIVE_APP==='true',
    ...(await serverSideTranslations(locale, ['common', ...(translations ?? [])])),
  },
})};

export default genGetProps;
