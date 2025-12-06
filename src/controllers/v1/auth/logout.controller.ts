/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 */
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshtoken = req.cookies.refreshToken as string;
    if (refreshtoken) {
      await Token.deleteOne({ token: refreshtoken });
      logger.info('User refresh token deleted successfully', {
        userId: req.userId,
        token: refreshtoken,
      });
    }
    res.clearCookie('refreshtoken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.sendStatus(204);
    logger.info('User logged out successfully', {
      userId: req.userId,
    });
  } catch (err) {
    logger.error('Error during logout', err);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
  }
};

export default logout;
