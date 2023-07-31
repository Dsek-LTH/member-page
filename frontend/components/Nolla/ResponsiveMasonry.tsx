import { Masonry } from '@mui/lab';
import { Box, Theme, useMediaQuery } from '@mui/material';

function CompactContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {children}
    </Box>
  );
}

function WideContainer({ children }: { children: React.ReactNode }) {
  return (
    <Masonry columns={2} spacing={4}>
      {children}
    </Masonry>
  );
}

function ResponsiveMasonry({ children }: { children: React.ReactNode }) {
  const smallScreen = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const container = smallScreen ? CompactContainer : WideContainer;
  return container({ children });
}
export default ResponsiveMasonry;
