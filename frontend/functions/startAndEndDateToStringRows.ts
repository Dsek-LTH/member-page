import { DateTime } from 'luxon';

const startAndEndDateToStringRows: (
  startDate: DateTime,
  endDate: DateTime
) => { row1: string; row2: string } = (startDate, endDate) => {
  const sameDay: Boolean = startDate.day === endDate.day;
  if (sameDay) {
    const dayDiff = startDate.diff(DateTime.now(), 'days').days;
    const row1 = dayDiff < 1 && dayDiff > -2 // yesterday or today
      ? startDate.toRelativeCalendar()
      : startDate.toLocaleString({
        ...DateTime.DATE_MED_WITH_WEEKDAY,
        year: startDate.year !== DateTime.now().year ? 'numeric' : undefined,
      });
    return {
      row1,
      row2: `${startDate.toLocaleString(
        DateTime.TIME_24_SIMPLE,
      )} - ${endDate.toLocaleString(DateTime.TIME_24_SIMPLE)}`,
    };
  }
  return {
    row1: startDate.toLocaleString({
      ...DateTime.DATE_MED_WITH_WEEKDAY,
      year: startDate.year !== DateTime.now().year ? 'numeric' : undefined,
    }),
    row2: `${startDate.toLocaleString({
      ...DateTime.DATETIME_MED_WITH_WEEKDAY,
      year: startDate.year !== DateTime.now().year ? 'numeric' : undefined,
    })} - ${endDate.toLocaleString({
      ...DateTime.DATETIME_MED_WITH_WEEKDAY,
      year: endDate.year !== DateTime.now().year ? 'numeric' : undefined,
    })}`,
  };
};

export default startAndEndDateToStringRows;
