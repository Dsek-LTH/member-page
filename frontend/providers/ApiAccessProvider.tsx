import React, { useMemo, useContext, PropsWithChildren } from 'react';
import { useApiAccessQuery } from '~/generated/graphql';

export type apiContextReturn = {
    apis: Set<string>,
    apisLoading: boolean
}

const defaultContext: apiContextReturn = {
  apis: new Set(),
  apisLoading: true,
};

const ApiAccessContext = React.createContext(defaultContext);

export function ApiAccessProvider({ children }: PropsWithChildren<{}>) {
  const { loading: apisLoading, data } = useApiAccessQuery();

  const memoized = useMemo(() => ({
    apis: new Set(data?.apiAccess?.map((api) => api.name)),
    apisLoading,
  }), [apisLoading, data?.apiAccess]);

  return (
    <ApiAccessContext.Provider value={memoized}>
      {children}
    </ApiAccessContext.Provider>
  );
}

export function useApiAccess() {
  const context = useContext(ApiAccessContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function hasAccess(context: apiContextReturn, name: string): boolean {
  return !context.apisLoading && context.apis.has(name);
}

export default ApiAccessContext;
