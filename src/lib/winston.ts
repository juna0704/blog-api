import winston from 'winston/';

/**
 * Custom modules
 */
import config from '../config';

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

const transports: winston.transport[] = [];

// if the application is not running in production, add a console transport
if (config.NODE_ENV !== 'Production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // add colors to log levels
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), // add timestam to logs
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : '';

          return `${timestamp} [${level}] : ${message} ${metaStr}`;
        }),
      ),
    }),
  );
}

// Create a logger instance using winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: config.NODE_ENV === 'test',
});

export { logger };
