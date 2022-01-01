import React from 'react';
import {
  IconButton, Menu, MenuItem, Link as MuiLink,
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
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
        {i18n.language !== 'sv' && (
          <MenuItem>
            <MuiLink href={`/sv${router.asPath}`}>Svenska</MuiLink>
          </MenuItem>
        )}
        {i18n.language !== 'en' && (
          <MenuItem>
            <MuiLink href={`/en${router.asPath}`}>English</MuiLink>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

export default LanguageSelector;
