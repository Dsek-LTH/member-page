import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';
import LightsController from '~/components/LightsController';

export default function BossPage() {
  useSetPageName('lights');

  return (
    <LightsController />
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
