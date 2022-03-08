import { useEffect } from 'react';

const useInterval = (callback: Function, delay: number) => {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [delay, callback]);
};

export default useInterval;
