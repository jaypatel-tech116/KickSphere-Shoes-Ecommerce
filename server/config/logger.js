import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: process.env.NODE_ENV !== 'production'
        ? format.combine(format.colorize(), format.simple())
        : format.json()
    })
  ]
});

export default logger;
