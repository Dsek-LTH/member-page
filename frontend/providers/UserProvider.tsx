import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  useContext, useMemo, PropsWithChildren, createContext, useEffect,
} from 'react';
import { useMeHeaderQuery, MeHeaderQuery, useUploadTokenMutation } from '~/generated/graphql';
import { useNotificationToken } from '~/providers/NativeAppProvider';
import routes from '~/routes';
import AddFoodPreferencePopup from './AddFoodPreferencePopup';

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
  const router = useRouter();
  const { data: session } = useSession();

  const {
    loading, data, error, refetch,
  } = useMeHeaderQuery();

  useEffect(() => {
    if (error?.message === 'Member not found') {
      router.push(routes.onboarding);
    }
  }, [error]);

  const user = data?.me;
  const memoized = useMemo(() => ({
    user, loading, error, refetch,
  }), [error, loading, refetch, user]);

  const notificationToken = useNotificationToken();
  const [uploadToken] = useUploadTokenMutation();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn('keycloak');
    }
  }, [session]);

  useEffect(() => {
    if (user && notificationToken) {
      uploadToken({ variables: { token: notificationToken } });
    }
  }, [user, uploadToken, notificationToken]);

  return (
    <userContext.Provider value={memoized}>
      <AddFoodPreferencePopup
        id={user?.id}
        open={(user?.student_id && user?.food_preference === null)}
        refetchUser={refetch}
      />
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
