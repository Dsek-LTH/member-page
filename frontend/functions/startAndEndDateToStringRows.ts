import { DateTime } from 'luxon';

const startAndEndDateToStringRows: (
  startDate: DateTime,
  endDate: DateTime
) => { row1: string; row2: string } = (startDate, endDate) => {
  const sameDay: Boolean = startDate.day === endDate.day;
  if (sameDay) {
    return {
      row1: startDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
      row2: `${startDate.toLocaleString(
        DateTime.TIME_24_SIMPLE,
      )} - ${endDate.toLocaleString(DateTime.TIME_24_SIMPLE)}`,
    };
  }
  return {
    row1: startDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
    row2: `${startDate.toLocaleString(
      DateTime.DATETIME_MED,
    )} - ${endDate.toLocaleString(DateTime.DATETIME_MED)}`,
  };
};

export default startAndEndDateToStringRows;
