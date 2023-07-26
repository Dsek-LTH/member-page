import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import CHECKLIST_COPY from '~/components/Nolla/copy/checklist';
import NollaLayout from '~/components/Nolla/layout';
import genGetProps from '~/functions/genGetServerSideProps';

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
export const getStaticProps = genGetProps(['nolla']);

function ChecklistPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? CHECKLIST_COPY.en : CHECKLIST_COPY.sv;
  return (
    <Main>
      <h1>{copy.checklista}</h1>
      <Copy>{copy.list()}</Copy>
    </Main>
  );
}

ChecklistPage.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

export default ChecklistPage;
