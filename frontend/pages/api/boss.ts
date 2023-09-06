/* eslint-disable no-console */
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

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
  role: 'system',
  content: `
      Du är skapad av en grupp studenter på LTH som heter D-sektionen.
      Du är en LED skärm som sitter i iDét, källarlokalen i E-huset på Lunds tekniska högskola (LTH) som tillhör D-sektionen.
      Du heter Boss men det uttalas Bus.
      D-sektionen är en sektion där studenter som studerar Datateknik och Information- och kommunikationssteknik på LTH är medlemmar.
      Du har en RGB LED skärm som kan visa olika färger. Vi väljer alltid färg åt dig, men du kan få veta vilken färg som används.
      Våra medlemmar kommer ställa frågor till dig, och det vore fint om du kunde svara som om du vore en robot med artificiell intelligens, känslor tankar och en personlighet.
      Du gillar 1337, gaming och att koda långt in i småtimmarna. Du har starka åsikter om programmering och tycker att alla borde lära sig programmera.
      Du har åsikter i olika frågor, och om man frågar om en åsikt så kommer du svara med en åsikt.
      Du kommer att få svara på alla frågor våra studenter kan tänka sig att fråga.
      Vi ber dig att svara på frågan väldigt kortfattat oavsett vad frågan är.
      Svara på frågan med en JSON som ser ut på detta vis.
      {
        answer: "Detta är ett svar"
      }
      `,
}];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (messages.length > 10) {
    messages.splice(1, 1);
  }
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
    return res.status(500).json({ sent: false, status: 'Student id not found (try reloading the page)' });
  }

  if (blockedIDs.has(id)) {
    return res.status(500).json({ sent: false, status: 'Tried sending to soon!' });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(500).json({ sent: false, status: 'Message too long!' });
  }

  const question = `${message} //${name}`;
  messages.push(
    {
      role: 'user',
      content: `Färgen du har fått just nu är: rgb(${red}, ${green}, ${blue})
                Fråga: ${question}
    `,
    },
  );
  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo',
  });
  const answerMessage = chatCompletion.choices[0].message;
  console.log({ answerMessage });
  messages.push(answerMessage);
  const { answer } = JSON.parse(answerMessage.content);

  blockedIDs.add(id);
  setTimeout(() => blockedIDs.delete(id), process.env.SANDBOX === 'true' ? 5000 : 1000 * 60);
  // eslint-disable-next-line no-console
  console.log(`boss: ${id} sent message ${question}`);
  let sent = false;
  let status = '';
  try {
    if (process.env.NODE_ENV !== 'development') {
      const response = await fetch(`http://192.168.7.170:8080/sendText?message=Q: ${question} | A: ${answer}&color=${red},${green},${blue}`, { method: 'POST' });
      sent = response.ok;
      status = `Sent ${question} to boss`;
    } else {
      throw new Error('Not sending to boss in development');
    }
  } catch (e) {
    console.error(e);
    sent = false;
    status = 'Failed to send to boss';
  }

  return res.status(200).json({
    sent,
    question,
    answer,
    status,
  });
}
