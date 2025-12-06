/**
 * Node module
 */
import { Schema, model, Types, Document } from 'mongoose';

export interface IComment {
  userId: Types.ObjectId;
  blogId: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>({
  blogId: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxLength: [1000, 'Content must be less than 1000 characters'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model<IComment>('Comment', commentSchema);
