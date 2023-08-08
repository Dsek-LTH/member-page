import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import MasonryCard from '~/components/Nolla/Card';
import ProfileCard from '~/components/Nolla/ProfileCard';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import GUILD_COPY from '~/components/Nolla/copy/guild';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';
import genGetProps from '~/functions/genGetServerSideProps';

const Main = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Logos = styled('div')`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const Logo = styled('img')`
  width: 90px;
  height: 120px;
  ${DESKTOP_MQ} {
    width: 190px;
    height: 256px;
  }
`;

function Row({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        flexWrap: 'wrap',
        gap: 4,
      }}
    >
      {children}
    </Box>
  );
}

export const getStaticProps = genGetProps(['nolla']);

function GuildNollaPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? GUILD_COPY.en : GUILD_COPY.sv;
  const translate = useNollaTranslate();
  return (
    <Main>
      <Box sx={{ maxWidth: '65ch', margin: 'auto' }}>
        <MasonryCard>
          <Typography variant="h4">{copy.d_guild}</Typography>
          <Typography variant="body1">{copy.guild_description}</Typography>
        </MasonryCard>
      </Box>

      <Logos>
        <Logo src="/images/nolla/d_logo_new.png" alt="Logotyp D-sektionen" />
      </Logos>

      <Typography
        variant="h5"
        fontWeight={500}
        textAlign="center"
        sx={{
          my: 5,
          textDecoration: 'underline solid hsl(317, 82%, 56%)',
          textUnderlineOffset: 16,
        }}
      >
        {translate('guild.board')}
      </Typography>

      <Box>
        <Row>
          <ProfileCard
            name="Sofia Tatidis"
            desc={(
              <>
                <Typography variant="body1" color="primary">
                  {translate('guild.chairman.title')}
                </Typography>
                <Typography variant="body1">
                  {translate('guild.chairman.text')}
                </Typography>
              </>
            )}
            image="/images/styrelsen/ordforande.jpg"
            offset={['50%', '100%']}
          />
        </Row>
      </Box>

      <Row>
        <ProfileCard
          name="Hampus Serneke"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.viceChairman.title')}
              </Typography>
              <Typography variant="body1">
                {translate('guild.viceChairman.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/vordforande.jpg"
        />
        <ProfileCard
          name="Rafael Holgersson"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.activities.title')}
              </Typography>
              <Typography variant="body1">
                {translate('guild.activities.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/aktivitetsansvarig.jpg"
          offset="50%"
        />
        <ProfileCard
          name="Oliver Levay"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.information.title')}
              </Typography>
              <Typography variant="body1">
                {translate('guild.information.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/informationsansvarig.jpg"
        />
        <ProfileCard
          name="Axel Svensson"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.treasurer.title')}
              </Typography>
              <Typography variant="body1">
                {translate('guild.treasurer.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/skattm.jpg"
        />
        <ProfileCard
          name="Julia Karlsson"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.facilities.title')}
              </Typography>
              <Typography variant="body1">
                {translate('guild.facilities.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/kallarm.jpg"
        />
        <ProfileCard
          name="Ludvig Svedberg"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.recreation.title')}
              </Typography>
              <Typography variant="body1">
                {translate('guild.recreation.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/sexm.jpg"
          offset={['55%', '90%']}
        />
        <ProfileCard
          name="Arvid Carp"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.cafe.title')}
              </Typography>
              <Typography variant="body1">Tjolahoppsan n0llan!</Typography>
              <Typography variant="body1">
                {translate('guild.cafe.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/cafem.jpg"
        />
        <ProfileCard
          name="Adam Coleman"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.corporateRelations.title')}
              </Typography>
              <Typography variant="body1">
                {translate('guild.corporateRelations.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/industrim.jpg"
        />
        <ProfileCard
          name="Mikolaj Sinicka"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                {translate('guild.studentCouncil.title')}
              </Typography>
              <Typography variant="body1">
                {translate('guild.studentCouncil.text')}
              </Typography>
            </>
          )}
          image="/images/styrelsen/srdordforande.jpg"
        />
      </Row>

      <Box sx={{ maxWidth: '65ch', margin: 'auto' }}>
        <MasonryCard>
          <Typography variant="h4">{translate('guild.dchip.title')}</Typography>
          <Typography variant="body1">{translate('guild.dchip.text')}</Typography>
          <Image
            src="/images/nolla/d_chip.jpg"
            alt="Glada d-sekare"
            width={4096}
            height={2731}
            layout="intrinsic"
            objectFit="cover"
          />
        </MasonryCard>
      </Box>
    </Main>
  );
}

GuildNollaPage.getLayout = function getLayout({ children }) {
  return <NollaLayout maxWidth="lg">{children}</NollaLayout>;
};

GuildNollaPage.theme = theme;

export default GuildNollaPage;
