/* eslint-disable no-underscore-dangle */
/**
 * ApolloClient setup
 * https://www.apollographql.com/docs/react/networking/authentication/
 */
import {
  ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { SSRAuthClient } from '@react-keycloak/ssr';
import isServer from './functions/isServer';

/**
  * @param {import('next').NextPageContext['req']} req
  * @param {import('next').NextPageContext['res']} res
  * @returns {Promise<ApolloClient>}
  */
export const createApolloServerClient = async (keycloak: SSRAuthClient) => {
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URL,
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: keycloak?.token ? `Bearer ${keycloak.token}` : '',
    },
  }));
  return new ApolloClient({
    ssrMode: true,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
      },
    },
  });
};

const createApolloClient = (keycloak: SSRAuthClient) => {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: keycloak?.token ? `Bearer ${keycloak.token}` : '',
    },
  }));
  return new ApolloClient({
    ssrMode: isServer,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Portfolio: {
          keyFields: ['id'],
        },
        Company: {
          keyFields: ['id'],
        },
      },
    }),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
      },
    },
  });
};

let apolloClient: ApolloClient<NormalizedCacheObject>;

/**
 * Creates and provides the apolloContext, with cache restored from the server
 * if you perform a graphql query on the server, the result will be cached
 * on the frontend, so you don't have to fetch it again. Basically enables
 * SSR for graphql
 * @param keycloak
 * @param serverCache
 * @returns
 */
export const createSpicyApolloClient = (keycloak: SSRAuthClient, serverCache = null):
ApolloClient<NormalizedCacheObject> => {
  /** We always want to use a fresh ApolloClient on the server */
  if (isServer) {
    apolloClient = createApolloClient(keycloak);
  }
  if (serverCache) {
    const clientCache = apolloClient.extract();
    /** Ensures we can still use client side cache */
    if (clientCache.ROOT_QUERY) {
      const data = merge(serverCache, clientCache, {
        // combine arrays using object equality (like in sets)
        arrayMerge: (destinationArray, sourceArray) => [
          ...sourceArray,
          ...destinationArray.filter((d) =>
            sourceArray.every((s) => !isEqual(d, s))),
        ],
      });
      apolloClient.cache.restore(data);
    } else {
      apolloClient.cache.restore(serverCache);
    }
  }

  return apolloClient;
};
