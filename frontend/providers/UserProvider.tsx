import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  useContext, useMemo, PropsWithChildren, createContext, useEffect, useState,
} from 'react';
import { useMeHeaderQuery, MeHeaderQuery, useUploadTokenMutation } from '~/generated/graphql';
import { useNotificationToken } from '~/providers/NativeAppProvider';
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

  const { status, data: session } = useSession();
  const router = useRouter();

  const notificationToken = useNotificationToken();
  const [uploadToken] = useUploadTokenMutation();

  /*   This solution is pretty bad,
  long term we would like to know from keycloak if onboarding is completed. */
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn('keycloak');
    }
    if (status === 'authenticated' && !data?.me && !loading) {
      if (shouldReroute) {
        router.push(routes.onboarding);
      } else {
        setShouldReroute(true);
      }
    }
  }, [data?.me, status, loading]);

  useEffect(() => {
    if (status === 'authenticated' && notificationToken) {
      uploadToken({ variables: { token: notificationToken } });
    }
  }, [status, uploadToken, notificationToken]);

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
