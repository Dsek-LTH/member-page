import React from 'react';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';

function Pepparna() {
  return (
    <div>Pepparna</div>
  );
}

export const getStaticProps = genGetProps(['nolla']);

Pepparna.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

Pepparna.theme = theme;

export default Pepparna;
