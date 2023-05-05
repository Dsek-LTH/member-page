import { useTranslation } from 'next-i18next';
import VolunteerInfo from '~/components/VolunteerInfo/VolunteerInfo';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function Benefits() {
  const { t } = useTranslation();
  useSetPageName(t('mandate:benefits'));
  return (
    <VolunteerInfo name="benefits" />
  );
}

export const getStaticProps = genGetProps(['mandate']);
