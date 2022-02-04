import { Breadcrumbs } from '@mui/material';
import React, { PropsWithChildren } from 'react';

function BreadcrumbLayout({
  breadcrumbsChildren,
  children,
}: PropsWithChildren<{ breadcrumbsChildren: React.ReactNode }>) {
  return (
    <>
      <Breadcrumbs style={{ padding: '1.6rem 0' }}>
        {breadcrumbsChildren}
      </Breadcrumbs>
      {children}
    </>
  );
}

export default BreadcrumbLayout;
