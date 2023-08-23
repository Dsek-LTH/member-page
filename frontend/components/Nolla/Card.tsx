import {
  Box, Paper, SxProps, Theme,
} from '@mui/material';
import React from 'react';

type Props = {
  children: [React.ReactNode, React.ReactNode, React.ReactNode?];
  sx?: SxProps<Theme>;
};

function MasonryCard({ children, sx }: Props) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <Paper
        sx={(theme) => ({
          borderRadius: 2,
          mb: children[2] ? 4 : undefined,
          border: '1px solid hsla(317, 82%, 56%, 0.25)',
          borderTop: `5px solid ${theme.palette.primary.main}`,
          boxShadow: '5px 5px 20px hsla(317, 82%, 56%, 0.1)',
        })}
      >
        <Box
          sx={{
            pb: 2,
            mb: 2,
            '&::after': {
              content: '""',
              border: '1px solid hsla(317, 82%, 56%, 1)',
              width: '40%',
              position: 'relative',
              display: 'block',
              left: 16,
              top: 16,
            },
          }}
        >
          <Box sx={{ px: 2, pt: 2 }}>{children[0]}</Box>
        </Box>
        <Box sx={{ px: 2, pb: 2 }}>{children[1]}</Box>
      </Paper>
      <Box
        sx={{
          '& img, & span': {
            boxShadow: '5px 5px 20px hsla(317, 82%, 56%, 0.1)',
            borderRadius: '15px',
          },
        }}
      >
        {children[2]}
      </Box>
    </Box>
  );
}

export default MasonryCard;
