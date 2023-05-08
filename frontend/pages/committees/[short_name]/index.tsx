import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Positions from '~/components/Positions';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function CommitteePage() {
  const router = useRouter();
  const { short_name: shortName } = router.query;
  const { t } = useTranslation();
  useSetPageName(t('committees'));
  return <Positions shortName={shortName.toString()} />;
}

export const getServerSideProps = genGetProps(['committee']);
