/**
 * Node modules
 */
import { Router } from 'express';
import { body, cookie } from 'express-validator';
import bcrypt from 'bcrypt';

/**
 * Controllers
 */

import register from '@/controllers/v1/auth/register.controller';
import login from '@/controllers/v1/auth/login.controller';
import refreshToken from '@/controllers/v1/auth/refresh_token.controller';
import authenticate from '@/middlewares/authenticate';

/**
 * Middlewares
 */
import validationError from '@/middlewares/validationError';

/**
 *Models
 */
import User from '@/models/user';
import { ref } from 'process';
import logout from '@/controllers/v1/auth/logout.controller';

const router = Router();

router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters long')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const UserExists = await User.exists({ email: value });
      if (UserExists) {
        throw new Error('User email or password is invalid');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
  validationError,
  register,
);

router.post(
  '/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 character')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const UserExists = await User.exists({ email: value });
      if (UserExists) {
        throw new Error('User email or password is invalid');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email }).select('password').lean().exec();

      if (!user) {
        throw new Error('User Email or Password is invalid');
      }
      const passwordMatch = await bcrypt.compare(value, user.password);

      if (!passwordMatch) {
        throw new Error('Password is incorrect');
      }
    }),
  validationError,
  login,
);

router.post(
  '/refresh-token',
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token'),
  validationError,
  refreshToken,
);

router.post('/logout', authenticate, logout);

export default router;
