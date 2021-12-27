import React from 'react';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

function Link({
  href,
  children,
  newTab,
  locale,
  underline = 'none',
}: {
  href: string;
  children: any;
  newTab?: boolean;
  locale?: string;
  underline?: 'none' | 'hover' | 'always';
}) {
  return (
    <NextLink href={href || ''} locale={locale}>
      <MuiLink
        underline={underline}
        height="fit-content"
        display="flex"
        href={href || ''}
        rel={newTab ? 'noopener noreferrer' : ''}
        target={newTab ? '_blank' : ''}
        style={{ whiteSpace: 'nowrap' }}
      >
        {children}
      </MuiLink>
    </NextLink>
  );
}

export default Link;
