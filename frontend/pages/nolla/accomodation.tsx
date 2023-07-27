import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import MasonryCard from '~/components/Nolla/Card';
import ResponsiveMasonry from '~/components/Nolla/ResponsiveMasonry';
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
  flex-direction: column;
  ${DESKTOP_MQ} {
    margin-bottom: 4rem;
    flex-direction: row;
  }
`;

const CorridorRoom = styled('img')`
  object-position: top;
  object-fit: contain;
  max-width: 400px;
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

const Copy = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: 50ch;
  ${DESKTOP_MQ} {
    font-size: 16px;
  }
`;
export const getStaticProps = genGetProps(['nolla']);

function AccomodationPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? ACCOMODATION_COPY.en : ACCOMODATION_COPY.sv;
  return (
    <Main>
      <MasonryCard sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={500}>{copy.boende}</Typography>
        <CopyAndHouse>
          <Typography variant="body1">{copy.main()}</Typography>
          <PinkHouse src="/images/nolla/pink_house.png" alt="Rosa hus" />
        </CopyAndHouse>
      </MasonryCard>
      <ResponsiveMasonry>
        <MasonryCard>
          <Typography variant="h5" fontWeight={500}>{copy.listTitle}</Typography>
          <Copy>{copy.list()}</Copy>
        </MasonryCard>
        <MasonryCard>
          <Typography variant="h5" fontWeight={500}>{copy.typeTitle}</Typography>
          <Copy>{copy.types()}</Copy>
          <CorridorRoom src="/images/nolla/corridor_room.jpg" alt="Korridorsrum" />
        </MasonryCard>
        <MasonryCard>
          <Typography variant="h5" fontWeight={500}>{copy.tipsTitle}</Typography>
          <Copy>
            {copy.tips()}
          </Copy>
          <CorridorRoom src="/images/nolla/floorplan.png" alt="Planskiss" />
        </MasonryCard>
      </ResponsiveMasonry>
    </Main>
  );
}

AccomodationPage.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

AccomodationPage.theme = theme;

export default AccomodationPage;
