import { useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useColorMode } from '~/providers/ThemeProvider';

function pageScroll(scrollSpeed: number) {
  window.scrollBy(0, 0.5 * (scrollSpeed >= 1 ? scrollSpeed : 1));
  setTimeout(() => {
    pageScroll(scrollSpeed);
  }, 10 / scrollSpeed);
}

export default function TVWrapper({ children }) {
  const router = useRouter();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  useEffect(() => {
    const { dark: darkString, zoom, scrollSpeed } = router.query;
    let dark = true;
    if (!darkString || darkString === 'false') {
      dark = false;
    }
    if (dark && theme.palette.mode === 'light') {
      toggleColorMode();
    } else if (!dark && theme.palette.mode === 'dark') {
      toggleColorMode();
    }
    if (zoom) {
      document.body.style.setProperty('zoom', zoom as string);
    }
    if (scrollSpeed) {
      pageScroll(Number(scrollSpeed));
    }
  }, [router.query]);
  return (
    <div style={{ padding: '1rem' }}>
      {children}
    </div>
  );
}
