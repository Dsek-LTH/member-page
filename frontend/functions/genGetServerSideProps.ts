import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const genGetProps = (translations?: string[]) => async ({ locale }) => ({
  props: {
    isNativeApp: process.env.SERVE_NATIVE_APP,
    ...(await serverSideTranslations(locale, ['common', ...(translations ?? [])])),
  },
});

export default genGetProps;
