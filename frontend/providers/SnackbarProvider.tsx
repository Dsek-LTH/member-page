import React, { useCallback, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type DefaultSnackbarProps = {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
};

type SnackbarContext = {
  showMessage(message: string, severity: 'success' | 'info' | 'warning' | 'error'): void;
};

const defaultContext: SnackbarContext = {
  showMessage: () => { },
};

const snackbarContext = React.createContext(defaultContext);

function DefaultSnackbar({
  message, open, severity, onClose,
}: DefaultSnackbarProps) {
  return (
    <Snackbar open={open} onClose={() => onClose()} autoHideDuration={6000}>

      <Alert severity={severity} variant="filled" elevation={6} onClose={() => onClose()}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const showMessage = useCallback((_message, _severity) => {
    setOpen(true);
    setMessage(_message);
    setSeverity(_severity);
  }, []);

  return (
    <>
      <snackbarContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{ showMessage }}
      >
        {children}
      </snackbarContext.Provider>

      <DefaultSnackbar
        message={message}
        severity={severity}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function useSnackbar() {
  const context = React.useContext(snackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export default snackbarContext;
