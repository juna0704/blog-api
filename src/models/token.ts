/**
 * Node modules
 */
import { Schema, model, Types } from 'mongoose';
import User from './user';

interface IToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model<IToken>('Token', tokenSchema);
