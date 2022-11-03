import React, { useMemo, useContext, PropsWithChildren } from 'react';
import { useApiAccessQuery } from '~/generated/graphql';

export type ApiAccessContext = {
  apis: Set<string>,
  apisLoading: boolean,
  hasAccess: (name: string) => boolean
};

const defaultContext: ApiAccessContext = {
  apis: new Set(),
  apisLoading: true,
  hasAccess: () => false,
};

const apiAccessContext = React.createContext(defaultContext);

export function ApiAccessProvider({ children }: PropsWithChildren<{}>) {
  const { loading: apisLoading, data } = useApiAccessQuery();

  const memoized = useMemo(() => ({
    apis: new Set(data?.apiAccess?.map((api) => api.name)),
    hasAccess: (name: string) => !apisLoading
    && new Set(data?.apiAccess?.map((api) => api.name)).has(name),
    apisLoading,
  }), [apisLoading, data?.apiAccess]);

  return (
    <apiAccessContext.Provider value={memoized}>
      {children}
    </apiAccessContext.Provider>
  );
}

export function useApiAccess() {
  const context = useContext(apiAccessContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function hasAccess(context: ApiAccessContext, name: string): boolean {
  return !context.apisLoading && context.apis.has(name);
}

export default apiAccessContext;
