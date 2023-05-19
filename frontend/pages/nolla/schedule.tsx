import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import genGetProps from '~/functions/genGetServerSideProps';
import SCHEDULE_COPY from '~/components/Nolla/copy/schedule';
import { DesktopOnly, MobileOnly } from '~/components/Nolla/responsive';

const Main = styled('div')`
  display: flex;
  flex-direction: column;
`;

const Maps = styled('div')`
  display: flex;
  flex-direction: column;
  ${DESKTOP_MQ} {
    flex-direction: row;
  }
`;

const Campus = styled('img')`
  width: 100%;
  object-fit: contain;
  ${DESKTOP_MQ} {
    padding-right: 5rem;
    width: 50%;
  }
  margin-bottom: 2rem;
`;

const EHouse = styled('img')`
  width: 100%;
  object-fit: contain;
  ${DESKTOP_MQ} {
    width: 50%;
    padding-left: 5rem;
  }
`;

export const getStaticProps = genGetProps(['nolla']);

function SchedulePage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? SCHEDULE_COPY.en : SCHEDULE_COPY.sv;
  return (
    <Main>
      <h1>{copy.schedule}</h1>
      <DesktopOnly>
        <iframe
          title="Schedule desktop"
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FStockholm&showTitle=0&showNav=1&showDate=1&showPrint=0&showCalendars=0&showTabs=1&showTz=1&mode=MONTH&src=NTNqb3A3OGVldHRvNXVqaGRrdHRjcDFvODhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%237CB342"
          style={{ borderWidth: 0 }}
          width="800"
          height="600"
        />
      </DesktopOnly>
      <MobileOnly>
        <iframe
          title="Schedule mobile"
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FStockholm&showTitle=0&showNav=1&showDate=1&showPrint=0&showCalendars=0&showTabs=0&showTz=1&mode=AGENDA&src=NTNqb3A3OGVldHRvNXVqaGRrdHRjcDFvODhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%237CB342"
          style={{ borderWidth: 0, width: '100%' }}
          height="600"
        />
      </MobileOnly>

      <h1>{copy.map}</h1>
      <Maps>
        <Campus src="/images/nolla/campus.png" />
        <EHouse src="/images/nolla/ehuset.png" />
      </Maps>
    </Main>
  );
}

SchedulePage.nolla = true;

export default SchedulePage;
