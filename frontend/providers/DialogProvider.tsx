import React, { useCallback, useState } from 'react';
import ConfirmDialog from '~/components/ConfirmDialog';

type DialogContextType = {
  confirm: (message: string, callback: (value: boolean) => void) => void;
};

const defaultContext: DialogContextType = {
  confirm: () => { },
};

const DialogContext = React.createContext(defaultContext);

export function DialogProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState<(value: boolean) => void>();
  const [message, setMessage] = useState('');

  const confirm: DialogContextType['confirm'] = useCallback((_message, _callback) => {
    setOpen(true);
    setMessage(_message);
    setCallback(() => _callback);
  }, []);

  return (
    <>
      <DialogContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{ confirm }}
      >
        {children}
      </DialogContext.Provider>

      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        handler={callback}
      >
        {message}
      </ConfirmDialog>
    </>
  );
}

export function useDialog() {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
