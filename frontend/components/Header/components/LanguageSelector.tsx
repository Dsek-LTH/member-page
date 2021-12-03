import React from 'react';
import Link from '~/components/Link';
import { IconButton, Menu, MenuItem } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useRouter } from 'next/router';

function LanguageSelector() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        id="language-selector-button"
        aria-controls="language-selector-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <TranslateIcon />
      </IconButton>
      <Menu
        id="language-selector-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-selector-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem>
          <Link href={router.asPath} locale="sv">
            Svenska
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href={router.asPath} locale="en">
            English
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default LanguageSelector;
