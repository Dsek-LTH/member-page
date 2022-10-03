import {
  ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink,
} from '@apollo/client';
import { NextApiRequest } from 'next';

const checkAccess = async (req: NextApiRequest, accessTag: string) => {
  const query = gql`
    query getUserAccess {
      apiAccess {
        name
      }
  }`;
  const { kcToken } = req.cookies;
  const apolloLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });
  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = kcToken ? atob(kcToken) : '';
    console.log(token);
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
    return forward(operation);
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authMiddleware.concat(apolloLink),
  });

  const { data } = await client.query({
    query,
  });
  const hasAccess = data.apiAccess.some((access) => access.name === accessTag);
  return hasAccess;
};

export default checkAccess;
