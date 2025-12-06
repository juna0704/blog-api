/**
 * Node_modules
 */
import mongoose from 'mongoose';

/**
 * Custom modules
 */
import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * Types
 */
import type { ConnectOptions } from 'mongoose';

/**
 * client option
 */
const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog Api',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.DB_URI) {
    throw new Error('MongoDB URI is not defined in the configuration.');
  }

  try {
    await mongoose.connect(config.DB_URI, clientOptions);
    console.log('Connected to the database successfull.', {
      uri: config.DB_URI,
      options: clientOptions,
    });
  } catch (err) {
    console.log('Error during connection to database.', err);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger.info('Disconnected from the database successfully.', {
      url: config.DB_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    logger.error('Error while disconnecting database', err);
  }
};
