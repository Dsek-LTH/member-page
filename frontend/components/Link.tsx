import React from 'react';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

const Link = ({
  href,
  children,
  newTab,
  locale,
}: {
  href: string;
  children: any;
  newTab?: boolean;
  locale?: string;
}) => (
  <NextLink href={href || ''} locale={locale}>
    <MuiLink
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
