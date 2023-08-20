import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import MasonryCard from '~/components/Nolla/Card';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';
import genGetProps from '~/functions/genGetServerSideProps';

function Map() {
  const translate = useNollaTranslate();
  const t = useTheme();
  const lightMode = t.palette.mode === 'light';

  return (
    <>
      <MasonryCard sx={{ maxWidth: '80ch', margin: 'auto' }}>
        <Typography variant="h5" fontWeight={500}>
          {translate('map.title')}
        </Typography>
        <Typography variant="body1">{translate('map.text')}</Typography>
      </MasonryCard>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          mt: 2,
          justifyContent: 'center',
          '& img': {
            filter: lightMode && 'invert(1) hue-rotate(180deg)',
          },
        }}
      >
        <Image
          src="/images/nolla/campus.png"
          alt="Campus"
          width={410}
          height={685}
          layout="intrinsic"
          objectFit="contain"
        />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          <Box>
            <Image
              src="/images/nolla/cellar.png"
              alt="Cellar"
              width={475}
              height={300}
              layout="intrinsic"
              objectFit="contain"
            />
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              {translate('map.cellar')}
            </Typography>
          </Box>
          <Box>
            <Image
              src="/images/nolla/floor1.png"
              alt="Floor 1"
              width={475}
              height={300}
              layout="intrinsic"
              objectFit="contain"
            />
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              {translate('map.floor1')}
            </Typography>
          </Box>
          <Box>
            <Image
              src="/images/nolla/floor2.png"
              alt="Floor 2"
              width={475}
              height={300}
              layout="intrinsic"
              objectFit="contain"
            />
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              {translate('map.floor2')}
            </Typography>
          </Box>
          <Box>
            <Image
              src="/images/nolla/floor3.png"
              alt="Floor 3"
              width={475}
              height={300}
              layout="intrinsic"
              objectFit="contain"
            />
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              {translate('map.floor3')}
            </Typography>
          </Box>
          <Box>
            <Image
              src="/images/nolla/floor4.png"
              alt="Floor 4"
              width={475}
              height={300}
              layout="intrinsic"
              objectFit="contain"
            />
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              {translate('map.floor4')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}

Map.getLayout = function getLayout({ children }) {
  return <NollaLayout maxWidth="lg">{children}</NollaLayout>;
};

Map.theme = theme;

export const getStaticProps = genGetProps(['nolla']);

export default Map;
