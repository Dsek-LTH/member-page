import TVWrapper from '~/components/TV/TVWrapper';
import genGetProps from '~/functions/genGetServerSideProps';
import EventsPage from '.';

function EventsTVPage() {
  return (
    <TVWrapper>
      <EventsPage />
    </TVWrapper>
  );
}

EventsTVPage.tv = true;

export default EventsTVPage;

export const getStaticProps = genGetProps(['event']);
