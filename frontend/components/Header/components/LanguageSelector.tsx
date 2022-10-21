import React, { useEffect } from 'react';
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
  useEffect(() => {
    const savedLocale = window.localStorage.getItem('locale');
    if (savedLocale && !window.location.href.includes(`/${savedLocale}`)) {
      if (router.pathname !== '/404') {
        router.push(router.asPath, null, { locale: savedLocale });
      } else {
        window.location.href = `/${savedLocale}${router.asPath}`;
      }
    }
  }, []);
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
