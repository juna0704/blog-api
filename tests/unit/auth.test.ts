// tests/unit/auth.test.ts
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../src/lib/jwt';
import config from '../../src/config';

describe('JWT Authentication Utilities', () => {
  const testUserId = new mongoose.Types.ObjectId();

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(testUserId);

      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should contain userId in payload', () => {
      const token = generateAccessToken(testUserId);
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty('userId');
      expect(decoded.userId).toBe(testUserId.toString());
    });

    it('should have correct subject', () => {
      const token = generateAccessToken(testUserId);
      const decoded = jwt.decode(token) as any;

      expect(decoded.sub).toBe(testUserId.toString());
    });

    it('should have expiration time', () => {
      const token = generateAccessToken(testUserId);
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty('exp');
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(testUserId);

      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should contain userId in payload', () => {
      const token = generateRefreshToken(testUserId);
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty('userId');
      expect(decoded.userId).toBe(testUserId.toString());
    });

    it('should generate different tokens than access token', () => {
      const accessToken = generateAccessToken(testUserId);
      const refreshToken = generateRefreshToken(testUserId);

      expect(accessToken).not.toBe(refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = generateAccessToken(testUserId);
      const payload = verifyAccessToken(token) as any;

      expect(payload).toHaveProperty('userId');
      expect(payload.userId).toBe(testUserId.toString());
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyAccessToken('invalid.token.here')).toThrow();
    });

    it('should throw error for expired token', () => {
      // Create a token that's already expired
      const expiredToken = jwt.sign({ userId: testUserId.toString() }, config.JWT_ACCESS_SECRET, {
        expiresIn: '0s',
      });

      // Wait a bit to ensure it's expired
      setTimeout(() => {
        expect(() => verifyAccessToken(expiredToken)).toThrow('jwt expired');
      }, 100);
    });

    it('should throw error for token signed with wrong secret', () => {
      const wrongToken = jwt.sign({ userId: testUserId.toString() }, 'wrong-secret', {
        expiresIn: '1h',
      });

      expect(() => verifyAccessToken(wrongToken)).toThrow();
    });

    it('should not verify refresh token as access token', () => {
      const refreshToken = generateRefreshToken(testUserId);

      expect(() => verifyAccessToken(refreshToken)).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = generateRefreshToken(testUserId);
      const payload = verifyRefreshToken(token) as any;

      expect(payload).toHaveProperty('userId');
      expect(payload.userId).toBe(testUserId.toString());
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyRefreshToken('invalid.token.here')).toThrow();
    });

    it('should not verify access token as refresh token', () => {
      const accessToken = generateAccessToken(testUserId);

      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });
  });

  describe('Token uniqueness', () => {
    it('should generate tokens with different iat timestamps when generated separately', async () => {
      const token1 = generateAccessToken(testUserId);
      const decoded1 = jwt.decode(token1) as any;

      // Wait 1 second to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const token2 = generateAccessToken(testUserId);
      const decoded2 = jwt.decode(token2) as any;

      // iat (issued at) should be different
      expect(decoded1.iat).not.toBe(decoded2.iat);
    });

    it('should generate different tokens for different users', () => {
      const userId1 = new mongoose.Types.ObjectId();
      const userId2 = new mongoose.Types.ObjectId();

      const token1 = generateAccessToken(userId1);
      const token2 = generateAccessToken(userId2);

      // Different users should always have different tokens
      expect(token1).not.toBe(token2);
    });
  });

  describe('Token lifecycle', () => {
    it('should generate and verify token successfully', () => {
      const token = generateAccessToken(testUserId);
      const payload = verifyAccessToken(token) as any;

      expect(payload.userId).toBe(testUserId.toString());
      expect(payload.sub).toBe(testUserId.toString());
    });

    it('should work with different user IDs', () => {
      const userId1 = new mongoose.Types.ObjectId();
      const userId2 = new mongoose.Types.ObjectId();

      const token1 = generateAccessToken(userId1);
      const token2 = generateAccessToken(userId2);

      const payload1 = verifyAccessToken(token1) as any;
      const payload2 = verifyAccessToken(token2) as any;

      expect(payload1.userId).toBe(userId1.toString());
      expect(payload2.userId).toBe(userId2.toString());
      expect(payload1.userId).not.toBe(payload2.userId);
    });
  });
});
