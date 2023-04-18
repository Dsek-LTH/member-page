import TranslateIcon from '@mui/icons-material/Translate';
import
{
  IconButton, Menu, MenuItem, Link as MuiLink,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

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
        disableScrollLock
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
          <MuiLink
            href={`/sv${router.asPath}`}
            onClick={() => {
              window.localStorage.setItem('locale', 'sv');
            }}
          >
            <MenuItem>Svenska</MenuItem>
          </MuiLink>
        )}
        {i18n.language !== 'en' && (
          <MuiLink
            href={`/en${router.asPath}`}
            onClick={() => {
              window.localStorage.setItem('locale', 'en');
            }}
          >
            <MenuItem>
              English
            </MenuItem>
          </MuiLink>
        )}
      </Menu>
    </div>
  );
}

export default LanguageSelector;
