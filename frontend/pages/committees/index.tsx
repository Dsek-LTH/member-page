import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import CommitteesList from '~/components/Committees/CommitteesList';
import createPageTitle from '~/functions/createPageTitle';
import genGetProps from '~/functions/genGetServerSideProps';

export default function Committees() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('committees')}</h2>
      <Head>
        <title>{createPageTitle(t, 'committees')}</title>
      </Head>
      <CommitteesList />
    </>
  );
}

export const getStaticProps = genGetProps(['committee']);
