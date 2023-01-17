import React, { useContext, useEffect, useMemo } from 'react';

export type AppEvents = {
  // This is the event that is fired when the native app has received a notification token
  // and wants to send it to the website
  SendNotificationToken: CustomEvent<{ notificationToken: string }>
};

export type NativeAppContext = {
  isNativeApp: boolean
  notificationToken?: string
};

const defaultContext: NativeAppContext = {
  isNativeApp: false,
};

const nativeAppContext = React.createContext(defaultContext);

export function NativeAppProvider({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('appSendNotificationToken', (event: AppEvents['SendNotificationToken']) => {
      window.alert(event.detail.notificationToken);
    });
  }, []);
  const memoizedValue = useMemo(() => {
    // Without this check, next crashes on the server side
    if (typeof window === 'undefined') {
      return { isNativeApp: false };
    }

    return {
      isNativeApp: (window as any)?.isNativeApp ?? false,
    };
  }, []);

  if (typeof window === 'undefined') {
    return children;
  }

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
