/**
 * Types
 */
import { Request, Response } from 'express';

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';
import User, { IUser } from '@/models/user';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { genUsername } from '@/utils';
import Token from '@/models/token';

/**
 * REGISTER CONTROLLER
 */
const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as Pick<IUser, 'email' | 'password' | 'role'>;

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'You cannot register as an admin',
    });
    logger.warn(
      `User with email ${email} tried to register as an admin but is not in the whitelist`,
    );
    return;
  }

  try {
    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        code: 'InvalidRequest',
        message: 'Email and password are required.',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      res.status(409).json({
        code: 'UserExists',
        message: 'User with this email already exists.',
      });
      return;
    }

    // Generate unique username
    const username = genUsername();

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || 'user',
    });

    // Generate Tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in db
    await Token.create({ token: refreshToken, userId: newUser._id });
    logger.info('Refresh token created for user', {
      userId: newUser._id,
      token: refreshToken,
    });

    // Set secure refreshToken cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user + access token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
    logger.info('User registered successfully', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    logger.error('Error during user registration', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
  }
};

export default register;
