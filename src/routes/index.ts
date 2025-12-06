/**
 * Node modules
 */

import { Router } from 'express';
const router = Router();

/**
 * Routes
 */
import authRoutes from '@/routes/v1/auth.routes';
import userRoutes from '@/routes/v1/user.routes';
import blogRoutes from '@/routes/v1/blog.routes';

/**
 * Root route
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'OK',
    version: '1.0.0',
    docs: 'http://docs.blog-api.junaidalikhan.com',
    timeStamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

export default router;
