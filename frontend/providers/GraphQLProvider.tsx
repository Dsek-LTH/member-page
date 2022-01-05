import React, { useEffect, useState, PropsWithChildren } from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { MeHeaderDocument } from '~/generated/graphql';
import routes from '~/routes';

const apolloLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
});

const createAuthLink = (token, language) => setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'Accept-Language': language,
    authorization: token ? `Bearer ${token}` : '',
  },
}));

const createClient = (token, language) => new ApolloClient({
  cache: new InMemoryCache(),
  link: createAuthLink(token, language).concat(apolloLink),
});

type GraphQLProviderProps = PropsWithChildren<{ ssrToken: string }>;

function GraphQLProvider({
  children,
  ssrToken,
}: GraphQLProviderProps) {
  const router = useRouter();
  const [client, setClient] = useState(createClient(ssrToken, 'en'));
  const { i18n } = useTranslation();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (!ssrToken && keycloak.token) {
      const newClient = createClient(keycloak.token, i18n.language);
      newClient.query({ query: MeHeaderDocument }).then(({ data }) => {
        if (!data.me) {
          router.push(routes.onboarding);
        }
      });
      setClient(newClient);
    } else {
      setClient(createClient(ssrToken, i18n.language));
    }
  }, [i18n.language, keycloak.token, router, ssrToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default GraphQLProvider;
