/* eslint-disable react/jsx-no-useless-fragment */
import React, { PropsWithChildren } from 'react';

function NoTitleLayout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {children}
    </>
  );
}

export default NoTitleLayout;
