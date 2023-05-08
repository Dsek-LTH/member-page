import {
  Stack, Typography,
} from '@mui/material';
import { i18n, useTranslation } from 'next-i18next';
import MarkdownPage from '~/components/MarkdownPage';
import genGetProps from '~/functions/genGetServerSideProps';
import selectTranslation from '~/functions/selectTranslation';
import { useSetPageName } from '~/providers/PageNameProvider';

export const getStaticProps = genGetProps(['contact']);

export default function ContactUsPage() {
  useSetPageName(selectTranslation(i18n, 'Kontakta Oss', 'Contact Us'));
  const { t } = useTranslation('contact');
  return (
    <>
      <Typography component="h1" variant="h2">
        {t('contact_details')}
      </Typography>
      <MarkdownPage name="contact" />
      <Stack />
    </>
  );
}
