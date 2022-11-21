/* eslint-disable no-console */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { UpdatePaymentStatusDocument, UpdatePaymentStatusMutation } from '~/generated/graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(404);
  }
  const { status, id } = req.body;
  if (!status || !id) {
    console.error('payment-callback', 'Invalid request body');
    res.status(400);
  }

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data, errors } = await client.mutate<UpdatePaymentStatusMutation>({
    mutation: UpdatePaymentStatusDocument,
    variables: { paymentId: id, status },
  });

  if (errors) {
    console.error('payment-callback', errors);
    res.status(500).json(errors);
  }

  console.log(data);
  return res.status(200).json(data);
}
