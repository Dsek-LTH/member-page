import React from 'react';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

function Link({
  href,
  children,
  newTab,
  locale,
  underline = 'none',
  style = {},
  color = 'primary',
}: {
  href?: string;
  children: any;
  newTab?: boolean;
  locale?: string;
  underline?: 'none' | 'hover' | 'always';
  style?: React.CSSProperties;
  color?: string,
}) {
  return (
    <NextLink href={href || ''} locale={locale}>
      <MuiLink
        underline={underline}
        height="fit-content"
        // display="flex"
        href={href || ''}
        rel={newTab ? 'noopener noreferrer' : ''}
        target={newTab ? '_blank' : ''}
        style={{ whiteSpace: 'nowrap', ...style }}
        color={color}
      >
        {children}
      </MuiLink>
    </NextLink>
  );
}

export default Link;
