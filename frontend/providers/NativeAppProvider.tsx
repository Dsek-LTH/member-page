import { useApolloClient } from '@apollo/client';
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';

export type AppEvents = {
  // This is the event that is fired when the native app has received a notification token
  // and wants to send it to the website
  SendNotificationToken: CustomEvent<{ token: string }>
};

export type NativeAppContext = {
  isNativeApp: boolean
  notificationToken?: string
};

const defaultContext: NativeAppContext = {
  isNativeApp: false,
};

const nativeAppContext = React.createContext(defaultContext);

export function NativeAppProvider({ children, isNativeApp }) {
  const [notificationToken, setNotificationToken] = useState(undefined);
  const apolloClient = useApolloClient();
  useEffect(() => {
    // Necessary for next as "window" is undefined when SSR
    if (typeof window === 'undefined') {
      return () => {};
    }
    // Use window object if notification token has been loaded before page loads
    const initialNotificationToken = (window as any)?.notificationToken;
    if (initialNotificationToken !== undefined) {
      setNotificationToken(initialNotificationToken);
    }
    // Use events if notification token loads, or updates, AFTER page initially loads
    const onSendNotificationToken = (event: AppEvents['SendNotificationToken']) => {
      setNotificationToken(event.detail.token);
    };
    window.addEventListener('appSendNotificationToken', onSendNotificationToken);
    return () => {
      window.removeEventListener('appSendNotificationToken', onSendNotificationToken);
    };
  }, []);

  useEffect(() => {
    // Necessary for next as "window" is undefined when SSR
    if (typeof window === 'undefined' || !apolloClient) {
      return () => {};
    }
    // Use events if notification token loads, or updates, AFTER page initially loads
    const onRefetch = () => {
      apolloClient.refetchQueries({
        include: 'all',
      });
    };
    window.addEventListener('appRefetch', onRefetch);
    return () => {
      window.removeEventListener('appRefetch', onRefetch);
    };
  }, [apolloClient]);

  const memoizedValue = useMemo(() => ({
    isNativeApp,
    notificationToken,
  }), [notificationToken, isNativeApp]);

  return (
    <nativeAppContext.Provider value={memoizedValue}>
      {children}
    </nativeAppContext.Provider>
  );
}

export function useIsNativeApp() {
  const context = useContext(nativeAppContext);
  if (context === undefined) {
    throw new Error('useIsNativeApp must be used within a NativeAppProvider');
  }
  return context.isNativeApp;
}
export function useNotificationToken() {
  const context = useContext(nativeAppContext);
  if (context === undefined) {
    throw new Error('useNotificationToken must be used within a NativeAppProvider');
  }
  return context.notificationToken;
}

export default nativeAppContext;
