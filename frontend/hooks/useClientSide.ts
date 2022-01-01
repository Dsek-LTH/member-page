import { useEffect, useState } from 'react';

/**
 * Returns false initially and on the server, but becomes true when the client has initiated
 */
export default () => {
  const [clientSide, setClientSide] = useState(false);
  useEffect(() => {
    setClientSide(true);
  }, [setClientSide]);
  return clientSide;
};
