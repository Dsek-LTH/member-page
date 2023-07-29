import { Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import MasonryCard from '~/components/Nolla/Card';
import CHECKLIST_COPY from '~/components/Nolla/copy/checklist';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';

export const getStaticProps = genGetProps(['nolla']);

function ChecklistPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? CHECKLIST_COPY.en : CHECKLIST_COPY.sv;
  return (
    <MasonryCard sx={{ maxWidth: '65ch', margin: 'auto' }}>
      <Typography variant="h5" fontWeight={500}>{copy.checklista}</Typography>
      <Typography variant="body1">{copy.list()}</Typography>
    </MasonryCard>
  );
}

ChecklistPage.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

ChecklistPage.theme = theme;

export default ChecklistPage;
