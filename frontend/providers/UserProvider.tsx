import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  useContext, useMemo, PropsWithChildren, createContext, useEffect, useState,
} from 'react';
import { useMeHeaderQuery, MeHeaderQuery } from '~/generated/graphql';
import routes from '~/routes';

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
  const [shouldReroute, setShouldReroute] = useState(false);
  const {
    loading, data, error, refetch,
  } = useMeHeaderQuery();
  const user = data?.me || undefined;

  const memoized = useMemo(() => ({
    user, loading, error, refetch,
  }), [error, loading, refetch, user]);

  const { status } = useSession();
  const router = useRouter();

  /*   This solution is pretty bad,
  long term we would like to know from keycloak if onboarding is completed. */
  useEffect(() => {
    if (status === 'authenticated' && !data?.me && !loading) {
      if (shouldReroute) {
        router.push(routes.onboarding);
      } else {
        setShouldReroute(true);
      }
    }
  }, [data?.me, status, loading]);

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
