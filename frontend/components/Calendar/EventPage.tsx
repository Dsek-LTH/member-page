import EventCard from '~/components/Calendar/EventCard';
import
{
  EventQuery,
} from '~/generated/graphql';

export default function EventPage({ event, refetch }: { event: EventQuery['event'], refetch: () => void }) {
  return (
    <EventCard event={event} refetch={refetch} showFull />
  );
}
