import { useTranslation } from 'next-i18next';
import VolunteerInfo from '~/components/VolunteerInfo/VolunteerInfo';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function Other() {
  const { t } = useTranslation();
  useSetPageName(t('mandate:other'));
  return (
    <VolunteerInfo name="other" />
  );
}

export const getStaticProps = genGetProps(['mandate']);
