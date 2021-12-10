import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type DefaultSnackbarProps = {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
}

type userContextReturn = {
  showMessage(message: string, severity: 'success' | 'info' | 'warning' | 'error'): void;
}

const defaultContext: userContextReturn = {
  showMessage: () => { },
};

const SnackbarContext = React.createContext(defaultContext)

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DefaultSnackbar({
  message, open, severity, onClose,
}: DefaultSnackbarProps) {
  return (
    <Snackbar open={open} onClose={() => onClose()} autoHideDuration={6000}>

      <Alert severity={severity} onClose={() => onClose()}>
        {message}
      </Alert>
    </Snackbar>
  )
}


export function SnackbarProvider({ children }) {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const showMessage = (message, severity,) => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
  }

  return (
    <>
      <SnackbarContext.Provider
        value={{
          showMessage: showMessage
        }}
      >
        {children}
      </SnackbarContext.Provider>

      <DefaultSnackbar
        message={message}
        severity={severity}
        //action={action}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function useSnackbar() {
  const context = React.useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export default SnackbarContext;
