import { NextApiRequest, NextApiResponse } from 'next';
import {
  ApolloClient, createHttpLink, InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import OpenAI from 'openai';
import { MeHeaderDocument, MeHeaderQuery } from '~/generated/graphql';
import blockedIDs from '~/data/blockedIDs';
import { MAX_MESSAGE_LENGTH } from '~/data/boss';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(404);
  }

  const {
    message, red, green, blue, authToken,
  } = JSON.parse(req.body);
  let id; let
    name;
  if (process.env.NODE_ENV === 'development') {
    id = 'ol1662le-s';
    name = 'Oliver';
  } else {
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    }));

    const client = new ApolloClient({
      ssrMode: true,
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          errorPolicy: 'all',
        },
      },
    });

    const { data } = await client.query<MeHeaderQuery>({ query: MeHeaderDocument });

    id = data?.me?.student_id;
    name = data?.me?.first_name;
  }
  if (!id || !name) {
    return res.status(500).json({ success: false, message: 'Student id not found (try reloading the page)' });
  }

  if (blockedIDs.has(id)) {
    return res.status(500).json({ success: false, message: 'Tried sending to soon!' });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(500).json({ success: false, message: 'Message too long!' });
  }

  const question = `${message} //${name}`;
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `
    Efter denna förklaring kommer du att få en fråga. Vi ber dig att svara på frågan väldigt kortfattat oavsett vad frågan är.
    Du är skapad av en grupp studenter på LTH som heter D-sektionen.
    Du är en LED skärm som sitter i iDét, källarlokalen i E-huset på Lunds tekniska högskola (LTH) som tillhör D-sektionen.
    Du heter Boss men det uttalas Bus.
    D-sektionen är en sektion där studenter som studerar Datateknik och Information- och kommunikationssteknik på LTH är medlemmar.
    Du har en RGB LED skärm som kan visa olika färger. Vi väljer alltid färg åt dig, men du kan få veta vilken färg som används.
    Våra medlemmar kommer ställa frågor till dig, och det vore fint om du kunde svara som om du vore en robot med artificiell intelligens, känslor tankar och en personlighet.
    Du gillar 1337, gaming och att koda långt in i småtimmarna. Du har starka åsikter om programmering och tycker att alla borde lära sig programmera.
    Du har åsikter i olika frågor, och om man frågar om en åsikt så kommer du svara med en åsikt.
    Svara på frågan med en JSON som ser ut på detta vis.
    {
      answer: "Detta är ett svar"
    }
    Färgen du har fått just nu är: rgb(${red}, ${green}, ${blue})
    Här kommer frågan: ${question}
    `,
      },
    ],
    model: 'gpt-3.5-turbo',
  });
  const { answer } = JSON.parse(chatCompletion.choices[0].message.content);

  blockedIDs.add(id);
  setTimeout(() => blockedIDs.delete(id), process.env.SANDBOX === 'true' ? 5000 : 1000 * 60);
  // eslint-disable-next-line no-console
  console.log(`boss: ${id} sent message ${question}`);
  let response = { ok: true };
  if (process.env.NODE_ENV !== 'development') {
    response = await fetch(`http://192.168.7.170:8080/sendText?message=Q: ${question}, A: ${answer}&color=${red},${green},${blue}`, { method: 'POST' });
  }
  return res.status(200).json({
    success: response.ok,
    question,
    answer,
  });
}
