import { Typography } from '@mui/material';
import MasonryCard from '~/components/Nolla/Card';
import ResponsiveMasonry from '~/components/Nolla/ResponsiveMasonry';
import NollaLayout from '~/components/Nolla/layout';
import genGetProps from '~/functions/genGetServerSideProps';
import theme from '~/components/Nolla/theme';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';

function Registration() {
  const translate = useNollaTranslate();

  return (
    <ResponsiveMasonry>
      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          {translate('registration.meaning.title')}
        </Typography>
        <Typography variant="body1">
          {translate('registration.meaning.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          {translate('registration.todo.title')}
        </Typography>
        <Typography variant="body1">
          {translate('registration.todo.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          {translate('registration.courses.title')}
        </Typography>
        <Typography variant="body1">
          {translate('registration.courses.text')}
        </Typography>
      </MasonryCard>
    </ResponsiveMasonry>
  );
}

Registration.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

export const getStaticProps = genGetProps(['nolla']);

Registration.theme = theme;

export default Registration;
