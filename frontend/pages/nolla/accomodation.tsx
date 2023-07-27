import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import ACCOMODATION_COPY from '~/components/Nolla/copy/accomodation';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';

const Main = styled('div')`
  display: flex;
  flex-direction: column;
  ul {
    padding-left: 1rem;
  }
`;

const CopyAndHouse = styled('div')`
  display: flex;
  margin-bottom: 2rem;
  flex-direction: column-reverse;
  ${DESKTOP_MQ} {
    margin-bottom: 4rem;
    flex-direction: row;
  }
`;

const CopyAndRouter = styled('div')`
  display: flex;
  margin-bottom: 2rem;
  flex-direction: column;
  ${DESKTOP_MQ} {
    flex-direction: row;
    margin-bottom: 4rem;
  }
`;

const PinkHouse = styled('img')`
  height: 5rem;
  width: 5rem;
  margin-left: auto;
  margin-bottom: 1rem;
  ${DESKTOP_MQ} {
    width: 10rem;
    height: 10rem;
    margin-left: 10rem;
  }
`;

const RouterContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  ${DESKTOP_MQ} {
    margin-left: 5rem;
  }
  font-size: 2rem;
`;

const Router = styled('img')`
  width: 100%;
  margin-top: 2rem;
  ${DESKTOP_MQ} {
    height: 20rem;
  }
`;

const Copy = styled('div')`
  display: flex;
  flex-direction: column;
  ${DESKTOP_MQ} {
    font-size: 24px;
  }
`;
export const getStaticProps = genGetProps(['nolla']);

function AccomodationPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? ACCOMODATION_COPY.en : ACCOMODATION_COPY.sv;
  return (
    <Main>
      <h1>{copy.boende}</h1>
      <CopyAndHouse>
        <Copy>{copy.main}</Copy>
        <PinkHouse src="/images/nolla/pink_house.png" alt="Rosa hus" />
      </CopyAndHouse>
      <CopyAndRouter>
        <Copy>{copy.list()}</Copy>
        <RouterContainer>
          <Router src="/images/nolla/router.png" alt="Router" />
          <span>127.0.0.1</span>
        </RouterContainer>
      </CopyAndRouter>
    </Main>
  );
}

AccomodationPage.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

AccomodationPage.theme = theme;

export default AccomodationPage;
