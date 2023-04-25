import VolunteerInfo from "~/components/VolunteerInfo/VolunteerInfo";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Benefits() {
  return (
    <VolunteerInfo name="benefits" />
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'mandate'])),
    },
  };
}