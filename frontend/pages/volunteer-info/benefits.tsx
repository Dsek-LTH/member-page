import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import VolunteerInfo from '~/components/VolunteerInfo/VolunteerInfo';

export default function Benefits() {
  return (
    <VolunteerInfo name="benefits" />
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'mandate'])),
    },
  };
}
