import React from 'react';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

function Link({
  href,
  children,
  newTab,
  locale,
  whiteSpace = 'pre-line',
  underline = 'none',
  style = {},
  color = 'primary',
}: {
  href?: string;
  children: any;
  newTab?: boolean;
  locale?: string;
  whiteSpace?: 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces',
  underline?: 'none' | 'hover' | 'always';
  style?: React.CSSProperties;
  color?: string,
}) {
  return (
    <NextLink href={href || ''} locale={locale}>
      <MuiLink
        underline={underline}
        height="fit-content"
        href={href || ''}
        rel={newTab ? 'noopener noreferrer' : ''}
        target={newTab ? '_blank' : ''}
        style={{ whiteSpace, ...style }}
        color={color}
      >
        {children}
      </MuiLink>
    </NextLink>
  );
}

export default Link;
