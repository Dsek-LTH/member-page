import { ApolloError } from '@apollo/client';
import * as React from 'react';
import { useMemo, PropsWithChildren } from 'react';
import { useMeHeaderQuery, MeHeaderQuery } from '~/generated/graphql';

type userContextReturn = {
  user: MeHeaderQuery['me'];
  loading: boolean;
  error: ApolloError;
  refetch: () => void;
};

const defaultContext: userContextReturn = {
  user: undefined,
  loading: true,
  error: null,
  refetch: () => {},
};

const UserContext = React.createContext(defaultContext);

export function UserProvider({ children }: PropsWithChildren<{}>) {
  const {
    loading, data, error, refetch,
  } = useMeHeaderQuery();
  const user = data?.me || undefined;

  const memoized = useMemo(() => ({
    user, loading, error, refetch,
  }), [error, loading, refetch, user]);

  return (
    <UserContext.Provider value={memoized}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
