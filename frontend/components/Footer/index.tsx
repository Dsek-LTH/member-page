import React from 'react';
import { useTranslation } from 'next-i18next';
import { IconButton, Stack } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box } from '@mui/system';
import Link from '../Link';

function Footer() {
  const { t } = useTranslation('common');

  return (
    <Box display="flex" justifyContent="center">
      <Stack
        direction={{ md: 'row', xs: 'column' }}
        justifyContent="space-between"
        paddingY={1}
        width="90%"
        alignItems="center"
        spacing={2}
      >
        <Stack spacing={2} direction="row">
          <Link href="mailto:dwww@dsek.se">dwww@dsek.se</Link>
          <Link href="https://github.com/Dsek-LTH/member-page" newTab>
            {t('source_code')}
          </Link>
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
    </Box>
  );
}

export default Footer;
