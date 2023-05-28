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
  onClick,
}: {
  href?: string;
  children: any;
  newTab?: boolean;
  locale?: string;
  whiteSpace?: 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces',
  underline?: 'none' | 'hover' | 'always';
  style?: React.CSSProperties;
  color?: string,
  onClick?: () => void,
}) {
  return (
    <NextLink href={href || ''} locale={locale} onClick={onClick}>
      <MuiLink
        underline={underline}
        height="fit-content"
        href={href || ''}
        rel={newTab ? 'noopener noreferrer' : ''}
        target={newTab ? '_blank' : ''}
        style={{ whiteSpace, ...style }}
        color={color}
        onClick={onClick}
      >
        {children}
      </MuiLink>
    </NextLink>
  );
}

export default Link;
