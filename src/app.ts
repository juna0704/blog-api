// src/app.ts
/**
 * App builder — returns configured Express app (no server start)
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import config from '@/config';
import limiter from './lib/express_rate_limit';
import { logger } from './lib/winston';

// Routes
import v1Routes from '@/routes';

const app = express();

// Configure CORS: allow empty origin in tests
const corsOptions = {
  origin(origin: any, callback: any) {
    if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS BLOCKED: ${origin}`);
      callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false);
    }
  },
};

app.use(cors(corsOptions as any));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024,
  }),
);
app.use(limiter);
app.use(helmet());

// Mount routes
app.use('/api/v1', v1Routes);

export default app;
