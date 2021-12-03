import React from 'react';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

const Link = ({
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
}) => (
  <NextLink href={href || ''} locale={locale}>
    <MuiLink
      underline={underline}
      height="fit-content"
      display="flex"
      href={href || ''}
      rel={newTab ? 'noopener noreferrer' : ''}
      target={newTab ? '_blank' : ''}
    >
      {children}
    </MuiLink>
  </NextLink>
);

export default Link;
