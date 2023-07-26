import React from 'react';
import NollaLayout from '~/components/Nolla/layout';
import genGetProps from '~/functions/genGetServerSideProps';

function FAQ() {
  return (
    <div>FAQ</div>
  );
}

export const getStaticProps = genGetProps(['nolla']);

FAQ.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

export default FAQ;
