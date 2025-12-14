/**
 * Custom modules
 */
import config from '@/config';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { logger } from './lib/winston';
import app from './app';

(async () => {
  try {
    await connectToDatabase();

    const server = app.listen(config.PORT, () => {
      logger.info(`Server running at: http://localhost:${config.PORT}`);
    });

    server.on('error', (err) => {
      logger.error('Server error:', err);
    });
  } catch (err) {
    logger.error('Failed to start the server', err);
  }
})();

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
