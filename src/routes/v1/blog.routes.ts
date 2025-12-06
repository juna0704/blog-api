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
import getBlogsByUser from '@/controllers/v1/blog/get_blogs_by_user.controller';
import getBlogBySlug from '@/controllers/v1/blog/get_blog_by_slug.controller';
import updateBlog from '@/controllers/v1/blog/update_blog.controller';
import deleteBlog from '@/controllers/v1/blog/delete_blog.controller';

const upload = multer();

const router = Router();

// Create Blog
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

// Retrive all Blogs
router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 1 }).withMessage('offset must be positive integer'),
  validationError,
  getAllBlogs,
);

// Retrive Blog by user ID
router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId').isMongoId().withMessage('Invalid user Id'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 1 }).withMessage('offset must be positive integer'),
  validationError,
  getBlogsByUser,
);

// Retrive Blog by Slug
router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').notEmpty().withMessage('Slug is required'),
  validationError,
  getBlogBySlug,
);

// Update Blog by UserID
router.put(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  upload.single('banner_image'),
  body('title')
    .optional()
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  validationError,
  uploadBloagBanner('put'),
  updateBlog,
);

// Delete Blog
router.delete('/:blogId', authenticate, authorize(['admin']), validationError, deleteBlog);

export default router;
