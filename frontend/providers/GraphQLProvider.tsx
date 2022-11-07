import React, {
  useEffect, useState, PropsWithChildren, useCallback, createContext, useMemo, useContext,
} from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useRouter } from 'next/router';
import { MeHeaderDocument } from '~/generated/graphql';
import routes from '~/routes';

const UpdateTokenContext = createContext({ updateToken: () => {} });

export function useUpdateToken() {
  const context = useContext(UpdateTokenContext);
  if (context === undefined) {
    throw new Error('useUpdateToken must be used within a GraphQLProvider');
  }
  return context;
}

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
});

type GraphQLProviderProps = PropsWithChildren<{ ssrToken: string }>;

function GraphQLProvider({
  children,
  ssrToken,
}: GraphQLProviderProps) {
  const [originalSsrToken] = useState(ssrToken);
  const router = useRouter();
  const { keycloak } = useKeycloak();
  const authLink = setContext((_, { headers }) => {
    let { token } = keycloak;
    if (!token) {
      token = ssrToken;
    }
    return ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  });
  const [client, setClient] = useState(new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authLink, httpLink]),
  }));

  const updateToken = useCallback(() => {
    const newClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: from([authLink, httpLink]),
    });
    setClient(newClient);
  }, [authLink]);

  const memoized = useMemo(() => ({
    updateToken,
  }), [updateToken]);

  useEffect(() => {
    // Just logged out
    if ((originalSsrToken && !ssrToken) || (ssrToken && !keycloak.authenticated)) {
      setClient(new ApolloClient({
        cache: new InMemoryCache(),
        link: from([authLink, httpLink]),
      }));
    }

    // Just logged in
    if (!ssrToken && keycloak.token) {
      const newClient = new ApolloClient({
        cache: new InMemoryCache(),
        link: from([authLink, httpLink]),
      });
      newClient.query({ query: MeHeaderDocument }).then(({ data }) => {
        if (!data.me) {
          router.push(routes.onboarding);
        }
      });
      setClient(newClient);
    }
  }, [keycloak.token, ssrToken, originalSsrToken]);

  return (
    <UpdateTokenContext.Provider value={memoized}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </UpdateTokenContext.Provider>
  );
}

export default GraphQLProvider;
