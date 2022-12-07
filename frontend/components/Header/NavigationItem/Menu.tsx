import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { NavigationItem as NavItem } from '../../Navigation/types/navigationItem';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import Link from '~/components/Link';

export default function NavigationItemMenu({
  item,
}: { item: NavItem }) {
  const { t } = useTranslation();
  const context = useApiAccess();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!item.hasAccess(context)) return null;

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id={`${item.translationKey}-button`}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {item.icon}
        <Box marginLeft={1} color="text.primary">
          {t(item.translationKey)}
        </Box>
      </Button>
      <Menu
        id={`${item.translationKey}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `${item.translationKey}-button`,
        }}
        disableScrollLock
      >
        {item.children?.map((child) => {
          if (!child.hasAccess(context)) return null;
          return (
            <Link href={child.path} key={child.translationKey}>
              <MenuItem onClick={handleClose}>
                {child.icon}
                <Box marginLeft={1} color="text.primary">
                  {t(child.translationKey)}
                </Box>
              </MenuItem>
            </Link>
          );
        })}
      </Menu>
    </div>
  );
}
