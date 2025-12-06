/**
 * Node module
 */
import { Schema, model, Types, Document } from 'mongoose';

export interface ILike {
  blogId?: Types.ObjectId;
  commentId?: Types.ObjectId;
  userId: Types.ObjectId;
}

// Create a document interface that extends both ILike and Document
interface ILikeDocument extends ILike, Document {}

const likeSchema = new Schema<ILike>({
  blogId: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Custom validation: At least one must exist
likeSchema.pre<ILikeDocument>('validate', function (next: any) {
  if (!this.blogId && !this.commentId) {
    return next(new Error('Either blogId or commentId must be provided'));
  }
  next();
});

export default model<ILike>('Like', likeSchema);
