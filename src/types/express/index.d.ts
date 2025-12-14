// src/@types/express/index.d.ts


/**
 * Types
 */
import { Types } from 'mongoose';

declare global {
  namespace Express {
    export interface Request {
      userId?: Types.ObjectId;
      user?: {
        _id: Types.ObjectId;
        role?: string;
        email?: string;
      };
    }
  }
}
