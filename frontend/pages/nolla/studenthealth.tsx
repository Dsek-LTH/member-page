import { Box, Typography } from '@mui/material';
import MasonryCard from '~/components/Nolla/Card';
import ProfileCard from '~/components/Nolla/ProfileCard';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';
import genGetProps from '~/functions/genGetServerSideProps';

export const getStaticProps = genGetProps(['nolla']);

function StudentHealthPage() {
  const translate = useNollaTranslate();

  return (
    <>
      <MasonryCard sx={{ maxWidth: '65ch', margin: 'auto' }}>
        <Typography variant="h5" fontWeight={500}>
          {translate('studenthealth.title')}
        </Typography>
        <Typography variant="body1">
          {translate('studenthealth.text')}
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
        {translate('studenthealth.committee.title')}
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
        <ProfileCard name="Moa Samuelsson" desc={translate('studenthealth.commitee.wellbeing')} image="/images/trivsel/moa.jpg" offset="25%" />
        <ProfileCard name="Thilda Holmner" desc={translate('studenthealth.commitee.equality')} image="/images/trivsel/thilda.png" />
        <ProfileCard name="Agnes Boberg" desc={translate('studenthealth.commitee.equality')} image="/images/trivsel/agnes.jpg" />
        <ProfileCard name="Signe Johansson" desc={translate('studenthealth.commitee.safety')} image="/images/trivsel/signe.jpg" offset="30%" />
        <ProfileCard name="Mowafak AlBitmouni" desc={translate('studenthealth.commitee.international')} image="/images/trivsel/mowafak.jpeg" offset="30%" />
      </Box>
    </>
  );
}

StudentHealthPage.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

StudentHealthPage.theme = theme;

export default StudentHealthPage;
