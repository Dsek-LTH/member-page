import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { useColorMode } from '~/providers/ThemeProvider';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function DarkModeSelector() {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  return (
    <IconButton onClick={toggleColorMode}>
      {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}

export default DarkModeSelector;
