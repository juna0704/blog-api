// tests/integration/auth.int.test.ts
import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/user';

describe('Auth flow (integration)', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'password123',
  };

  it('registers a new user and returns access token', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser).expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(testUser.email);

    // verify db
    const user = await User.findOne({ email: testUser.email }).lean().exec();
    expect(user).toBeTruthy();
    expect(user!.email).toBe(testUser.email);
  });

  it('logs in the user and sets refresh cookie + returns accessToken', async () => {
    // ensure user exists (if previous test ran it will)
    const res = await request(app).post('/api/v1/auth/login').send(testUser).expect(200);

    expect(res.body).toHaveProperty('accessToken');
    // supertest exposes cookies via res.headers['set-cookie']
    expect(Array.isArray(res.headers['set-cookie'])).toBeTruthy();
    // cookie should contain 'refreshToken'
    const cookieString = (res.headers['set-cookie'] as unknown as string[]).join(';');
    expect(cookieString.includes('refreshToken')).toBeTruthy();
  });
});
