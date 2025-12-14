// tests/jest.setup.ts
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// Only connect to DB for integration and e2e tests
const currentTestPath = expect.getState().testPath || '';
const isUnitTest = currentTestPath.includes('/unit/');

if (!isUnitTest) {
  beforeAll(async () => {
    if (!process.env.DB_URI) {
      throw new Error('DB_URI is missing in .env.test');
    }

    await mongoose.connect(process.env.DB_URI);
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
}
