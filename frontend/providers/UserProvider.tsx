import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  useContext, useMemo, PropsWithChildren, createContext, useEffect,
} from 'react';
import { useMeHeaderQuery, MeHeaderQuery } from '~/generated/graphql';
import { useUpdateToken } from './GraphQLProvider';

type UserContext = {
  user: MeHeaderQuery['me'];
  loading: boolean;
  error: ApolloError;
  refetch: () => Promise<ApolloQueryResult<MeHeaderQuery>>;
};

const defaultContext: UserContext = {
  user: undefined,
  loading: true,
  error: null,
  refetch: null,
};

const userContext = createContext(defaultContext);

export function UserProvider({ children }: PropsWithChildren<{}>) {
  const { keycloak } = useKeycloak();
  const { updateToken } = useUpdateToken();
  const {
    loading, data, error, refetch,
  } = useMeHeaderQuery();
  const user = data?.me || undefined;

  const memoized = useMemo(() => ({
    user, loading, error, refetch,
  }), [error, loading, refetch, user]);

  useEffect(() => {
    if (keycloak.authenticated && !user && !loading) {
      updateToken();
    }
  }, [user, keycloak.authenticated]);

  return (
    <userContext.Provider value={memoized}>
      {children}
    </userContext.Provider>
  );
}

export function useUser() {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default userContext;
