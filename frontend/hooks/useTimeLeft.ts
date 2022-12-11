import { useEffect, useState } from 'react';

// time diff in milliseconds
const timeDiff = (date1: Date, date2: Date) => {
  const diff = date2.getTime() - date1.getTime();
  return diff;
};

// milliseconds to minutes and seconds
const msToTime = (duration: number) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes}m ${seconds}s`;
};

export default function useTimeLeft(endDate: string, onFinished: () => void) {
  const [timeLeft, setTimeLeft] = useState(1000 * 60 * 60);
  useEffect(() => {
    setTimeLeft(timeDiff(new Date(), new Date(endDate)));
    // update timeleft every second
    const interval = setInterval(() => {
      setTimeLeft(timeDiff(new Date(), new Date(endDate)));
    }, 1000);
    const msRemaining = timeDiff(new Date(endDate), new Date());
    setTimeout(() => {
      onFinished();
    }, msRemaining + 500);
    return () => clearInterval(interval);
  }, [endDate]);
  return [timeLeft, msToTime(timeLeft)];
}
