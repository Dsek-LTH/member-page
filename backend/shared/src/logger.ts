import { createLogger, format, transports } from 'winston';

const {
  combine, timestamp, label, printf,
} = format;

const myFormat = printf(({
  level, message, service, timestamp: ts,
}) => `${ts} [${service}] ${level}: ${message}`);

const logConfig = (service: string) => ({
  transports: [
    new transports.Console({ level: 'info' }),
  ],
  defaultMeta: { service },
  format: combine(
    label({ label: service }),
    timestamp(),
    myFormat,
  ),
});

export default (service: string) => createLogger(logConfig(service));
