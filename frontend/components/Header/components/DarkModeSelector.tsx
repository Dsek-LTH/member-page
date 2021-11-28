import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { useColorMode } from '~/providers/ThemeProvider';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function DarkModeSelector() {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  return (
    <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
      {theme.palette.mode === 'dark' ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  );
}

export default DarkModeSelector;
