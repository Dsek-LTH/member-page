import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import routes from '~/routes';

function AppLandingPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(routes.guild);
  });
  return null;
}

export default AppLandingPage;
