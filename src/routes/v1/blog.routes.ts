/**
 * Node modules
 */
import { Router } from 'express';
import { param, query, body } from 'express-validator';
import multer from 'multer';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import uploadBloagBanner from '@/middlewares/uploadBlogBanner';

/**
 * Controllers
 */
import createBlog from '@/controllers/v1/blog/create_blog.controller';
import getAllBlogs from '@/controllers/v1/blog/get_all_blogs.controller';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  body('banner_image').notEmpty().withMessage('Banner image is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must me either draft or published'),
  validationError,
  upload.single('banner_image'),
  uploadBloagBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 1 }).withMessage('offset must be positive integer'),
  validationError,
  getAllBlogs,
);

export default router;
