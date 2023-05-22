import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import GUILD_COPY from '~/components/Nolla/copy/guild';
import genGetProps from '~/functions/genGetServerSideProps';

const Main = styled('div')`
  display: flex;
  flex-direction: column;
`;

const Paragraph = styled('p')`
  ${DESKTOP_MQ} {
    font-size: 24px;
  }
`;

const Logos = styled('div')`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const Logo = styled('img')`
  width: 118px;
  height: 118px;
  ${DESKTOP_MQ} {
    width: 341px;
    height: 341px;
  }
`;

const TechLogo = styled('img')`
  margin-top: 1rem;
  width: 100%;
  object-fit: contain;
  ${DESKTOP_MQ} {
    margin-top: 2rem;
  }
`;
export const getStaticProps = genGetProps(['nolla']);

function GuildNollaPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? GUILD_COPY.en : GUILD_COPY.sv;
  return (
    <Main>
      <h1>{copy.d_guild}</h1>
      <Paragraph>{copy.guild_description}</Paragraph>

      <Logos>
        <Logo src="/images/nolla/d_logo.png" alt="Logotyp D-sektionen" />
        <Logo src="/images/nolla/c_logo.png" alt="C logotyp" />
      </Logos>

      <h1>{copy.karen}</h1>
      <Paragraph>{copy.karen_description}</Paragraph>
      <TechLogo src="/images/nolla/teknologkaren.png" alt="Teknologkårens logotyp" />
    </Main>
  );
}

GuildNollaPage.nolla = true;

export default GuildNollaPage;
