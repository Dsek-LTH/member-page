import React, { PropsWithChildren } from 'react';

function NoTitleLayout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <h2 style={{ visibility: 'hidden' }}>__</h2>
      {children}
    </>
  );
}

export default NoTitleLayout;
