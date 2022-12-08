import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import MarkdownPage from '~/components/MarkdownPage';

export default function CafePage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('cafe')}</h2>
      <MarkdownPage name="cafe" />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
