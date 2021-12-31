import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { createEvents, EventAttributes } from 'ics';
import { DateTime } from 'luxon';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const { lang } = req.query;
  const isEnglish = lang === 'en';
  const query = gql`query Events($start_datetime: Datetime, $end_datetime: Datetime) {
    events(
      filter: { start_datetime: $start_datetime, end_datetime: $end_datetime }
    ) {
      events {
        id
        title
        short_description
        description
        start_datetime
        end_datetime
        link
        location
        organizer
        number_of_updates
        title_en
        description_en
      }
    }
  }`;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data, error } = await client.query({
    query,
    variables: {
      start_datetime: DateTime.now().minus({ months: 1 }).toUTC(),
      end_datetime: DateTime.now().plus({ months: 3 }).toUTC(),
    },
  });

  if (error) {
    return res.status(400).end(error);
  }

  const icsEvents: EventAttributes[] = data.events.events.map((event) => {
    const start = DateTime.fromISO(event.start_datetime).setLocale('sv');
    const end = DateTime.fromISO(event.end_datetime).setLocale('sv');

    const description = (isEnglish && event.description_en)
      ? event.description_en
      : event.description;
    const title = isEnglish && event.title_en ? event.title_en : event.title;

    return <EventAttributes>{
      uid: event.id,
      start: [start.year, start.month, start.day, start.hour, start.minute],
      end: [end.year, end.month, end.day, end.hour, end.minute],
      title: title || '',
      description: description || '',
      location: event.location ? event.location : '',
      // Specifying organizer makes goolgle calendar refuse to import the ical file.
      // organizer: event.organizer ? { name: event.organizer } : null,
      sequence: event.number_of_updates,
    };
  });

  const calendar = createEvents(icsEvents);

  if (calendar.error) {
    return res.status(400).end(calendar.error);
  }

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename="D-sektionen_events.ics"');
  return res.status(200).end(calendar.value);
}
