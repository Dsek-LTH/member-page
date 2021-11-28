import React from 'react';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

const Link = ({
  href,
  children,
  newTab,
}: {
  href: string;
  children: any;
  newTab?: boolean;
}) => (
  <NextLink href={href || ''}>
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
