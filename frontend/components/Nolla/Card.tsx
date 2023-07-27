import { Box } from '@mui/material';
import React from 'react';

type Props = {
  children: [React.ReactNode, React.ReactNode, React.ReactNode?];
};

function MasonryCard({ children }: Props) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={(theme) => ({
          borderRadius: 2,
          mb: children[2] ? 4 : -2,
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
      </Box>
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

// function MasonryCard({ children }: Props) {
//   return (
//     <Box sx={{ position: 'relative' }}>
//       {children}
//     </Box>
//   );
// }

export default MasonryCard;
