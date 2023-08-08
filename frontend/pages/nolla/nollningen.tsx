import { Typography } from '@mui/material';
import Image from 'next/image';
import MasonryCard from '~/components/Nolla/Card';
import ResponsiveMasonry from '~/components/Nolla/ResponsiveMasonry';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';
import NollaLayout from '../../components/Nolla/layout';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';

function Nollningen() {
  const translate = useNollaTranslate();

  return (
    <ResponsiveMasonry>
      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          {translate('nollningen.what.title')}
        </Typography>
        <Typography variant="body1">
          {translate('nollningen.what.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          {translate('nollningen.when.title')}
        </Typography>
        <Typography variant="body1">
          {translate('nollningen.when.text')}
        </Typography>
        <Image
          src="/images/nolla/nollningen_when.jpg"
          alt="Glada d-sekare"
          width={1992}
          height={1328}
          layout="intrinsic"
          objectFit="cover"
        />
      </MasonryCard>

      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          {translate('nollningen.happening.title')}
        </Typography>
        <Typography variant="body1">
          {translate('nollningen.happening.text')}
        </Typography>
      </MasonryCard>

      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          {translate('nollningen.participate.title')}
        </Typography>
        <Typography variant="body1">
          {translate('nollningen.participate.text')}
        </Typography>
        <Image
          src="/images/nolla/nollningen_what.jpg"
          alt="Glada d-sekare"
          width={2048}
          height={1365}
          layout="intrinsic"
          objectFit="cover"
        />
      </MasonryCard>
    </ResponsiveMasonry>
  );
}

export const getStaticProps = genGetProps(['nolla']);

Nollningen.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

Nollningen.theme = theme;

export default Nollningen;
