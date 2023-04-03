import { useRouter } from 'next/router';
import Positions from '~/components/Positions';
import genGetProps from '~/functions/genGetServerSideProps';

export default function CommitteePage() {
  const router = useRouter();
  const { short_name: shortName } = router.query;
  return <Positions shortName={shortName.toString()} />;
}

export const getServerSideProps = genGetProps(['committee']);
