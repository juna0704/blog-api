/**
 * Node modules
 */
import bcrypt from 'bcrypt';

/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 */
import User from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as UserData;

    // Validate email/password exists
    if (!email || !password) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'Email and password are required',
      });
      return;
    }
    // Find user with password
    const user = await User.findOne({ email }).select('username email password role');

    if (!user) {
      res.status(404).json({
        code: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    // Password Check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in db
    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh token created for user', {
      userId: user._id,
      token: refreshToken,
    });

    // Set secure refreshToken cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict',
    });

    // Return user + access token
    res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
    logger.info('User logged in successfully', {
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    logger.error('Error during login', err);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
  }
};

export default login;
