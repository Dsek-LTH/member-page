import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import Link from '~/components/Link';
import { NavigationItem } from './types';

export default function NavigationItemComponent({
  item,
  onItemClick,
}: { item: NavigationItem, onItemClick: (e: any) => void }) {
  const context = useApiAccess();
  const { t } = useTranslation();
  if (!item.hasAccess(context)) return null;
  return (
    <Link href={item.path}>
      <Button onClick={onItemClick}>
        {item.icon}
        <Box marginLeft={1} color="text.primary">
          {t(item.translationKey)}
        </Box>
      </Button>
    </Link>
  );
}
