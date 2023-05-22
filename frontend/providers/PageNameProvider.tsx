import Head from 'next/head';
import React, {
  PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'next-i18next';

export type PageNameContext = {
  fullName: string,
  shortName: string,
  setName: (name: string, shortName?: string) => void
};

const defaultContext: PageNameContext = {
  fullName: '',
  shortName: '',
  setName: () => {},
};

const pageNameContext = React.createContext(defaultContext);

export function PageNameProvider({ children }: PropsWithChildren<{}>) {
  const [fullName, setFullname] = useState('');
  const [shortName, setShortName] = useState('');
  const { t } = useTranslation();

  const setName: PageNameContext['setName'] = useCallback((name, _shortName) => {
    setFullname(name);
    setShortName(_shortName || name);
  }, [setFullname, setShortName]);

  const memoized = useMemo(() => ({
    fullName,
    shortName,
    setName,
  }), [fullName, shortName, setName]);
  const pageTitle = fullName.length === 0 ? t('siteName') : `${fullName} - ${t('siteName')}`;

  return (
    <>
      <Head>
        <title>
          {pageTitle}
        </title>
      </Head>
      <pageNameContext.Provider value={memoized}>
        {children}
      </pageNameContext.Provider>
    </>
  );
}

export function useSetPageName(pageName: string, shortName?: string) {
  const context = useContext(pageNameContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  useEffect(() => {
    context.setName(pageName, shortName);
  }, [context, pageName, shortName]);
}

export function usePageName() {
  const context = useContext(pageNameContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return { shortName: context.shortName, fullName: context.fullName };
}

export default pageNameContext;
