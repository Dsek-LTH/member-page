import { useTranslation } from 'next-i18next';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function CafePage() {
  const { t } = useTranslation();
  useSetPageName(t('cafe'));
  return (
    <PageHeader>{t('cafe')}</PageHeader>
  );
}

export const getStaticProps = genGetProps(['news']);
