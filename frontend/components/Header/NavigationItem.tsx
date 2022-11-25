import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { NavigationItem as NavItem } from '../Navigation/types/navigationItem';

export default function NavigationItem({
  item,
}: { item: NavItem }) {
  const { t } = useTranslation();
  return (
    <Button>
      {item.icon}
      <Box marginLeft={1} color="text.primary">
        {t(item.translationKey)}
      </Box>
    </Button>
  );
}
