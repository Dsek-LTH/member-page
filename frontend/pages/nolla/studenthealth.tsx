import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import genGetProps from '~/functions/genGetServerSideProps';
import STUDENTHEALTH_COPY from '~/components/Nolla/copy/studenthealth';

const Main = styled('div')`
  display: flex;
  flex-direction: column;
  ul {
    padding-left: 1rem;
  }
`;

const Copy = styled('div')`
  display: flex;
  flex-direction: column;
  ${DESKTOP_MQ} {
    font-size: 24px;
  }
`;

const HappyZeros = styled('img')`
  margin-top: 2rem;
  width: 100%;
  height: 100%;
  max-width: 55rem;
  margin-left: auto;
  object-fit: contain;
`;

export const getStaticProps = genGetProps(['nolla']);

function StudentHealthPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? STUDENTHEALTH_COPY.en : STUDENTHEALTH_COPY.sv;
  return (
    <Main>
      <h1>{copy.title}</h1>
      <Copy>{copy.copy()}</Copy>

      <HappyZeros
        alt="Glada nollor"
        src="/images/nolla/glada_nollor.png"
        width={1274}
        height={910}
      />
    </Main>
  );
}

StudentHealthPage.nolla = true;

export default StudentHealthPage;
