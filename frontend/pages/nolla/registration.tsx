import React from 'react';
import NollaLayout from '~/components/Nolla/layout';

function Registration() {
  return (
    <div>Registration</div>
  );
}

Registration.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

export default Registration;
