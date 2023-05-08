import { styled } from '@mui/system';
import { DESKTOP_MQ } from '~/components/Nolla/constants';

const Container = styled('div')`
  max-width: 40rem;
`;

const Label = styled('p')`
  font-size: 14px;
  ${DESKTOP_MQ} {
    font-size: 1rem;
  }
`;

const LoadingBarBackground = styled('div')`
  position: relative;
  z-index: 0;
  height: 2rem;
  width: 100%;
  background: rgba(196, 196, 196, 0.12);
`;

const LoadingBarForeground = styled('div')`
  height: 2rem;
  background: rgba(242, 128, 161, 0.4);
  position: absolute;
  left: 0;
  top: 0;
`;

const nollningStartDate = new Date();
nollningStartDate.setMonth(7);
nollningStartDate.setDate(1);
while (nollningStartDate.getDay() !== 1) {
  nollningStartDate.setDate(nollningStartDate.getDate() + 1);
}
nollningStartDate.setDate(nollningStartDate.getDate() + 14);
const nollningStart = nollningStartDate.getTime();
const now = new Date().getTime();
const startOfTheYearDate = new Date();
startOfTheYearDate.setMonth(0);
startOfTheYearDate.setDate(1);
const startOfTheYear = startOfTheYearDate.getTime();

const daysFromStartOfTheYear = (nollningStart - startOfTheYear) / (1000 * 3600 * 24);

const daysUntilNollning = (nollningStart - now) / (1000 * 3600 * 24);

let loadingBarWidth = ((daysFromStartOfTheYear
  - daysUntilNollning) / daysFromStartOfTheYear) * 100;

if (loadingBarWidth < 0) {
  loadingBarWidth = 0;
} else if (loadingBarWidth > 100) {
  loadingBarWidth = 100;
}
export default function CountDown() {
  return (
    <Container>
      <Label>
        &gt; loading &quot;n0llning&quot;...
        {' '}
        {daysUntilNollning.toFixed()}
        {' '}
        dagar
        kvar...
      </Label>
      <LoadingBarBackground>
        <LoadingBarForeground
          style={{ width: `${loadingBarWidth.toFixed()}%` }}
        />
      </LoadingBarBackground>
    </Container>
  );
}
