import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logConfig = {
  transports: [
    new transports.Console({ level: 'info' }),
  ],
  defaultMeta: { service: 'core-service' },
  format: combine(
    label({ label: 'core-service' }),
    timestamp(),
    myFormat,
  ),
};

export default createLogger(logConfig);
