import { Box, Typography } from '@mui/material';
import MasonryCard from '~/components/Nolla/Card';
import ProfileCard from '~/components/Nolla/ProfileCard';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';

export const getStaticProps = genGetProps(['nolla']);

function StudentHealthPage() {
  return (
    <>
      <MasonryCard sx={{ maxWidth: '65ch', margin: 'auto' }}>
        <Typography variant="h5" fontWeight={500}>
          Må bra
        </Typography>
        <Typography variant="body1">
          Om du någon gång mår dåligt eller känner dig illa behandlad under din
          tid här på LTH och under nollningen så finns det flera ställen du kan
          vända dig till. På sektionen finns Trivselrådet som består av vår
          Trivselmästare, Likabehandlingsombud, Skyddsombud och Världsmästare (tar
          hand om alla internationella frågor). Det finns även hjälp att få
          utanför sektionen så som Studenthälsan vid Lunds universitet, LTHs
          kuratorer och Studentprästerna (länkar till dessa finns nedan). Din
          hälsa är viktig för oss och vill erbjuda en så trygg miljö som möjligt,
          tveka därför aldrig att höra av dig till den organisation du känner dig
          mest bekväm med. Du kan alltid också höra av dig till ansvariga på ett
          event eller till ledningen inom nollningsutskottet om du vill prata om
          något!
        </Typography>
      </MasonryCard>
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
        Trivselrådet
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          gap: 4,
          mt: 4,
          '& > *': {
            flex: '1 1 250px',
          },
        }}
      >
        <ProfileCard name="Moa Samuelsson" desc="Trivselmästare" image="/images/trivsel/moa.jpg" offset="25%" />
        <ProfileCard name="Thilda Holmner" desc="Likabehandlingsombud" image="/images/trivsel/thilda.png" />
        <ProfileCard name="Agnes Boberg" desc="Likabehandlingsombud" image="/images/trivsel/agnes.jpg" />
        <ProfileCard name="Signe Johansson" desc="Skyddsombud" image="/images/trivsel/signe.jpg" offset="30%" />
        <ProfileCard name="Mowafak AlBitmouni" desc="Världsmästare" image="/images/trivsel/mowafak.jpeg" offset="30%" />
      </Box>
    </>
  );
}

StudentHealthPage.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

StudentHealthPage.theme = theme;

export default StudentHealthPage;
