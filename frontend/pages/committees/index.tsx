import { useTranslation } from 'next-i18next';
import CommitteesList from '~/components/Committees/CommitteesList';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function Committees() {
  const { t } = useTranslation();
  useSetPageName(t('committees'));
  return (
    <>
      <h2>{t('committees')}</h2>
      <CommitteesList />
    </>
  );
}

export const getStaticProps = genGetProps(['committee']);
