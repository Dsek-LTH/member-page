import VolunteerInfo from '~/components/VolunteerInfo/VolunteerInfo';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function Access() {
  useSetPageName('Access');

  return (
    <VolunteerInfo name="access" />
  );
}

export const getStaticProps = genGetProps(['mandate']);
