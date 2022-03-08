import { useEffect } from 'react';

export const useInterval = (callback: Function, delay: number) => {
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}