import {
  Stack, Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import MarkdownPage from '~/components/MarkdownPage';
import genGetProps from '~/functions/genGetServerSideProps';

export const getStaticProps = genGetProps(['contact']);

export default function ContactUsPage() {
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
