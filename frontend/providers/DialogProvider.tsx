import React, { useCallback, useState } from 'react';
import ConfirmDialog from '~/components/ConfirmDialog';
import RequestNumberDialog from '~/components/RequestNumberDialog';

type DialogContextType = {
  confirm: (message: string, callback: (value: boolean) => void) => void;
  requestNumber: (message: string, label: string, callback: (value: number) => void) => void;
};

const defaultContext: DialogContextType = {
  confirm: () => { },
  requestNumber: () => { },
};

const DialogContext = React.createContext(defaultContext);

export function DialogProvider({ children }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<(value: boolean) => void>();
  const [numberOpen, setNumberOpen] = useState(false);
  const [numberCallback, setNumberCallback] = useState<(value: number) => void>();
  const [message, setMessage] = useState('');
  const [label, setLabel] = useState('');

  const confirm: DialogContextType['confirm'] = useCallback((_message, _callback) => {
    setConfirmOpen(true);
    setMessage(_message);
    setConfirmCallback(() => _callback);
  }, []);

  const requestNumber: DialogContextType['requestNumber'] = useCallback((_message, _label, _callback) => {
    setNumberOpen(true);
    setMessage(_message);
    setLabel(_label);
    setNumberCallback(() => _callback);
  }, []);

  return (
    <>
      <DialogContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{ confirm, requestNumber }}
      >
        {children}
      </DialogContext.Provider>

      <ConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        handler={confirmCallback}
      >
        {message}
      </ConfirmDialog>
      <RequestNumberDialog
        open={numberOpen}
        setOpen={setNumberOpen}
        handler={numberCallback}
        label={label}
      >
        {message}
      </RequestNumberDialog>
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
