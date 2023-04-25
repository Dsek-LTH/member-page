import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { IconButton, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
// import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { Container } from '@mui/system';
import routes from '~/routes';
import { SHAResult } from '~/types/SHAResult';
import Link from '../Link';

function Footer() {
  const { t } = useTranslation('common');
  const [shaResult, setShaResult] = useState<SHAResult | undefined>();

  useEffect(() => {
    fetch('/api/gitsha').then((res) => res.json()).then((data) => setShaResult(data));
  }, []);

  return (
    <Container>
      <Stack
        direction={{ md: 'row', xs: 'column' }}
        justifyContent="space-between"
        paddingY={1}
        width="90%"
        alignItems="center"
        spacing={2}
      >
        <Stack spacing={2} direction="row">
          <Link href={routes.contactUs}>{t('contact')}</Link>
          <Link href="https://github.com/Dsek-LTH/member-page" newTab>
            {t('source_code')}
          </Link>
          {shaResult
          && (
          <Link href={shaResult.treeLink || ''} newTab>
            Git HEAD:
            {' '}
            {shaResult.shortSHA}
          </Link>
          )}
        </Stack>
        <Stack spacing={1} direction="row">
          <Link href="https://instagram.com/dseklth/" newTab>
            <IconButton>
              <InstagramIcon />
            </IconButton>
          </Link>
          <Link href="https://facebook.com/Dsektionen/" newTab>
            <IconButton>
              <FacebookIcon />
            </IconButton>
          </Link>
          <Link
            href="https://youtube.com/channel/UCqBtN7xlh4_VvywKaRiGfkw/"
            newTab
          >
            <IconButton>
              <YouTubeIcon />
            </IconButton>
          </Link>
          <Link href="https://github.com/Dsek-LTH/" newTab>
            <IconButton>
              <GitHubIcon />
            </IconButton>
          </Link>
          <Link
            href="https://linkedin.com/company/datatekniksektionen-vid-tlth/"
            newTab
          >
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Footer;
