import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CafePage() {
    return(
        <>
            <h2>Hej hopp</h2>
            <p>bajs</p>
        </> 
    )
}

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  }