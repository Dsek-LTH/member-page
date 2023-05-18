import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import PACKINGLIST_COPY from '~/components/Nolla/copy/packinglist';
import PostItNote from '~/components/Nolla/PostItNote';
import genGetProps from '~/functions/genGetServerSideProps';

const Main = styled('div')`
  display: flex;
  flex-direction: column;
  ul {
    padding-left: 1rem;
  }
`;

const BikeDiv = styled('div')`
  margin: 1rem 0;
  flex-direction: column;
  ${DESKTOP_MQ} {
    margin: 2rem 0;
    flex-direction: row;
  }
  display: flex;
`;

const BikePostIt = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  font-size: 60px;
  transform: rotate(-20deg);
  font-weight: 700;
  margin-top: 6rem;
`;

const Divider = styled('div')`
  margin-top: 3rem;
  ${DESKTOP_MQ} {
    margin-right: 5rem;
  }
`;

const Paragraph = styled('p')`
  ${DESKTOP_MQ} {
    font-size: 1.5rem;
  }
`;

const DressCodeWrapper = styled('div')`
`;

const PostItsContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const PostItRow = styled('div')`
  display: flex;
  flex-direction: column;
  ${DESKTOP_MQ} {
    flex-direction: row;
    justify-content: space-around;
  }
  margin: 2rem 0;
`;

const DressCodeTitle = styled('p')`
  font-weight: 700;
  font-size: 2rem;
  margin: 1rem 0;
`;

const DressCodeBody = styled('p')`
  margin: 0;
  font-size: 1.65rem;
`;

export const getStaticProps = genGetProps(['nolla']);

function PackingListPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? PACKINGLIST_COPY.en : PACKINGLIST_COPY.sv;
  return (
    <Main>
      <h1>{copy.what_to_bring}</h1>
      <BikeDiv>
        <PostItNote>
          <BikePostIt>{copy.bike}</BikePostIt>
        </PostItNote>
        <Divider />
        <Paragraph>{copy.bike_copy}</Paragraph>
      </BikeDiv>
      <Paragraph>{copy.dresscodes_copy}</Paragraph>
      <DressCodeWrapper>
        <h1>{copy.this_is_a_list}</h1>
        <PostItsContainer>
          <PostItRow>
            <PostItNote>
              <DressCodeTitle>{copy.formal.title}</DressCodeTitle>
              <DressCodeBody>{copy.formal.description}</DressCodeBody>
            </PostItNote>
            <Divider />
            <PostItNote purple>
              <DressCodeTitle>{copy.black_tie.title}</DressCodeTitle>
              <DressCodeBody>{copy.black_tie.description}</DressCodeBody>
            </PostItNote>
          </PostItRow>
          <PostItRow>
            <PostItNote purple>
              <DressCodeTitle>{copy.themes.title}</DressCodeTitle>
              <DressCodeBody>{copy.themes.description}</DressCodeBody>
            </PostItNote>
            <Divider />
            <PostItNote>
              <DressCodeTitle>{copy.semi_formal.title}</DressCodeTitle>
              <DressCodeBody>{copy.semi_formal.description}</DressCodeBody>
            </PostItNote>
          </PostItRow>
        </PostItsContainer>
      </DressCodeWrapper>
    </Main>
  );
}

PackingListPage.nolla = true;

export default PackingListPage;
