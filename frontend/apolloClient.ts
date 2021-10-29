import { SSRAuthClient, useKeycloak } from "@react-keycloak/ssr";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { isServer } from "./functions/isServer";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { useMemo } from "react";

let apolloClient;

const createApolloClient = (keycloak?: SSRAuthClient) => {
  const apolloLink = createHttpLink({
    uri: isServer
      ? "http://46.162.93.155:4000/graphql"
      : process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: keycloak?.token ? `Bearer ${keycloak.token}` : "",
      },
    };
  });
  return new ApolloClient({
    ssrMode: isServer,
    link: authLink.concat(apolloLink),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (initialState?, keycloak?: SSRAuthClient) => {
  const _apolloClient = apolloClient ?? createApolloClient(keycloak);

  if (initialState) {
    const existingCache = _apolloClient.extract();

    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });
    _apolloClient.cache.restore(data);
  }

  if (isServer) {
    return _apolloClient;
  }
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }
  return _apolloClient;
};

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

export function useApollo(pageProps) {
  const { keycloak } = useKeycloak();
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state, keycloak), [state]);
  return store;
}
