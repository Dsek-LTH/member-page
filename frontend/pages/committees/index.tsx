import { useTranslation } from 'next-i18next';
import CommitteesList from '~/components/Committees/CommitteesList';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function Committees() {
  const { t } = useTranslation();
  useSetPageName(t('committees'));
  return (
    <>
      <PageHeader>{t('committees')}</PageHeader>
      <CommitteesList />
    </>
  );
}

export const getStaticProps = genGetProps(['committee']);
