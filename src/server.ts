/**
 * Node Modules
 * src/server.ts
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */
import config from '@/config';
import limiter from './lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { logger } from './lib/winston';

/**
 * Router
 */
import v1Routes from '@/routes/';

/**
 * Types
 */
import type { CorsOptions } from 'cors';

/**
 * Express app initial
 */
const app = express();

// Configure CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS BLOCKED: ${origin}`);
      callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false);
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable compression
app.use(
  compression({
    threshold: 1024,
  }),
);

// Rate limit globally
app.use(limiter);

// Add security headers
app.use(helmet());

/**
 * Start server + Connect DB
 */
(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Routes);

    const server = app.listen(config.PORT, () => {
      logger.info(`Server running at: http://localhost:${config.PORT}`);
    });

    // Handle server-specific errors
    server.on('error', (err) => {
      logger.error('Server error:', err);
    });
  } catch (err) {
    logger.error('Failed to start the server', err);
  }
})();

/**
 * Graceful shutdown handler
 */
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info('Server Shutdown');
    process.exit(0);
  } catch (err) {
    logger.error('Error during server shutdown', err);
    process.exit(1);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
