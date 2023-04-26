import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import VolunteerInfo from '~/components/VolunteerInfo/VolunteerInfo';

export default function Access() {
  return (
    <VolunteerInfo name="access" />
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'mandate'])),
    },
  };
}