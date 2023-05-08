import { styled } from '@mui/system';
import Copy from '~/components/Nolla/Copy';
import CountDown from '~/components/Nolla/CountDown';
import genGetProps from '~/functions/genGetServerSideProps';

const Main = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const getStaticProps = genGetProps(['nolla']);

function NollaPage() {
  return (
    <Main>
      <CountDown />
      <Copy />
    </Main>
  );
}

NollaPage.nolla = true;

export default NollaPage;
