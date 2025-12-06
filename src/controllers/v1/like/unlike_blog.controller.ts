/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import Like from '@/models/like';

/**
 * Types
 */
import type { Request, Response } from 'express';

const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId } = req.params;
    const userId = req.user?._id;

    // 1. Validate blog
    const blogExists = await Blog.exists({ _id: blogId });
    if (!blogExists) {
      return;
    }

    // 2. Check if like exists
    const existingLike = await Like.findOne({ userId, blogId }).exec();
    if (!existingLike) {
      return;
    }

    // 3. Delete the like
    await Like.deleteOne({ _id: existingLike._id });

    // 4. Atomically decrement likesCount
    await Blog.updateOne({ _id: blogId }, { $inc: { likesCount: -1 } });

    logger.info('Blog unliked successfully', {
      userId,
      blogId,
    });

    res.sendStatus(204);
  } catch (err) {
    logger.error('Error while unliking a blog', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
  }
};

export default unlikeBlog;
