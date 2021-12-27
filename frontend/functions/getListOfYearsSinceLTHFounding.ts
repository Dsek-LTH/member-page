import { Interval, DateTime } from 'luxon';

function* dates(interval: Interval) {
  let cursor = interval.start.startOf('year');
  while (cursor < interval.end) {
    yield cursor;
    cursor = cursor.plus({ years: 1 });
  }
}

const getListOfYearsSinceLTHFounding = () => {
  const start = DateTime.local(1961, 1, 1);
  const end = DateTime.now().plus({ years: 1 });
  const interval = Interval.fromDateTimes(start, end);
  const datesList = Array.from(dates(interval)).reverse();
  return datesList.map((date) => date.year.toString());
};

export default getListOfYearsSinceLTHFounding;
