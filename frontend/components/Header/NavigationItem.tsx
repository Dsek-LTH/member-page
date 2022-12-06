import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { NavigationItem as NavItem } from '../Navigation/types/navigationItem';

export default function NavigationItem({
  item,
}: { item: NavItem }) {
  const context = useApiAccess();
  const { t } = useTranslation();
  if (!item.hasAccess(context)) return null;
  return (
    <Button>
      {item.icon}
      <Box marginLeft={1} color="text.primary">
        {t(item.translationKey)}
      </Box>
    </Button>
  );
}
