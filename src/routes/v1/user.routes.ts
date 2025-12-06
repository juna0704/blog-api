/**
 * Node modules
 */
import { Router } from 'express';
import { param, query, body } from 'express-validator';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';

/**
 * Controllers
 */
import getCurrentUser from '@/controllers/v1/user/get_current_user.controller';
import updateCurrentUser from '@/controllers/v1/user/update_current_user.controller';
import deleteCurrentUser from '@/controllers/v1/user/delete_current_user.controller';
import getAllUser from '@/controllers/v1/user/get_all_user.controller';
import getUser from '@/controllers/v1/user/ger_user.controller';
import deleteUser from '@/controllers/v1/user/delete_user.controller';

/**
 * Models
 */
import User from '@/models/user';

const router = Router();

router.get('/current', authenticate, authorize(['admin', 'user']), getCurrentUser);

router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less than 20 characters')
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });
      if (userExists) {
        throw Error('This username is already in use');
      }
    }),
  body('email')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });
      if (userExists) {
        throw Error('This username is already in use');
      }
    }),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('first_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  body('last_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  body(['website', 'facebook', 'instagram', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('URL must be lenght 100 character'),
  validationError,
  updateCurrentUser,
);

router.delete('/current', authenticate, authorize(['admin', 'user']), deleteCurrentUser);

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 1 }).withMessage('offset must be positive integer'),
  validationError,
  getAllUser,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  validationError,
  getUser,
);

router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  validationError,
  deleteUser,
);

export default router;
