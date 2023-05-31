import React, { useEffect } from 'react';
import { LoadingButtonProps, LoadingButton as MuiLoadingButton } from '@mui/lab';

const LOADING_DELAY = 100;

type Props = Omit<LoadingButtonProps, 'onClick'> & {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
};

export default function LoadingButton({ onClick, ...props }: Props) {
  const [loading, setLoading] = React.useState(props.loading);

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);
  return (
    <MuiLoadingButton
      {...props}
      onClick={async (e) => {
        const timeout = setTimeout(() => {
          setLoading(true);
        }, LOADING_DELAY);
        await onClick(e);
        clearTimeout(timeout);
        setLoading(false);
      }}
      loading={loading}
    />
  );
}
