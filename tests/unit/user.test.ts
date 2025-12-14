// tests/unit/user.test.ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../../src/models/user';

// Setup DB connection for this test file
beforeAll(async () => {
  const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/blog-test';

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUri);
  }
});

// Clean up after each test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await User.deleteMany({});
  }
});

// Close connection after all tests
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});

describe('User Model', () => {
  describe('User creation', () => {
    it('should create a valid user with required fields', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.role).toBe('user'); // Default role
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should create user with all optional fields', async () => {
      const userData = {
        username: 'fulluser',
        email: 'full@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin' as const,
        socialLinks: {
          website: 'https://example.com',
          facebook: 'https://facebook.com/johndoe',
          instagram: 'https://instagram.com/johndoe',
          x: 'https://x.com/johndoe',
          youtube: 'https://youtube.com/johndoe',
        },
      };

      const user = await User.create(userData);

      expect(user.username).toBe(userData.username);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.role).toBe('admin');
      expect(user.socialLinks?.website).toBe(userData.socialLinks.website);
      expect(user.socialLinks?.facebook).toBe(userData.socialLinks.facebook);
    });
  });

  describe('Field validations', () => {
    it('should fail without required username', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
      });

      let error;
      try {
        await user.save();
      } catch (err: any) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.username).toBeDefined();
    });

    it('should fail without required email', async () => {
      const user = new User({
        username: 'testuser',
        password: 'password123',
      });

      let error;
      try {
        await user.save();
      } catch (err: any) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.email).toBeDefined();
    });

    it('should fail without required password', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
      });

      let error;
      try {
        await user.save();
      } catch (err: any) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.password).toBeDefined();
    });

    it('should fail with invalid email format', async () => {
      const user = new User({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      });

      let error;
      try {
        await user.save();
      } catch (err: any) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.email).toBeDefined();
    });

    it('should fail with password shorter than 6 characters', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345',
      });

      let error;
      try {
        await user.save();
      } catch (err: any) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.password).toBeDefined();
    });
  });

  describe('Unique constraints', () => {
    it('should fail with duplicate username', async () => {
      await User.create({
        username: 'uniqueuser',
        email: 'unique1@example.com',
        password: 'password123',
      });

      let error;
      try {
        await User.create({
          username: 'uniqueuser',
          email: 'unique2@example.com',
          password: 'password123',
        });
      } catch (err: any) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    });

    it('should fail with duplicate email', async () => {
      await User.create({
        username: 'user1',
        email: 'duplicate@example.com',
        password: 'password123',
      });

      let error;
      try {
        await User.create({
          username: 'user2',
          email: 'duplicate@example.com',
          password: 'password123',
        });
      } catch (err: any) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    });
  });

  describe('Password hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'mySecurePassword123';
      const user = await User.create({
        username: 'hashtest',
        email: 'hash@example.com',
        password: plainPassword,
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toHaveLength(60);
      expect(user.password.startsWith('$2b$')).toBe(true);
    });

    it('should verify hashed password with bcrypt', async () => {
      const plainPassword = 'testPassword456';
      const user = await User.create({
        username: 'verifytest',
        email: 'verify@example.com',
        password: plainPassword,
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await bcrypt.compare(plainPassword, userWithPassword!.password);

      expect(isMatch).toBe(true);
    });

    it('should not rehash password if not modified', async () => {
      const user = await User.create({
        username: 'nohashtest',
        email: 'nohash@example.com',
        password: 'password123',
      });

      const originalHash = user.password;
      user.firstName = 'Updated';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });

  describe('Field transformations', () => {
    it('should convert email to lowercase', async () => {
      const user = await User.create({
        username: 'lowercasetest',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      });

      expect(user.email).toBe('test@example.com');
    });

    it('should trim whitespace from username', async () => {
      const user = await User.create({
        username: '  trimuser  ',
        email: 'trim@example.com',
        password: 'password123',
      });

      expect(user.username).toBe('trimuser');
    });
  });

  describe('Default values', () => {
    it('should have default role as "user"', async () => {
      const user = await User.create({
        username: 'defaultrole',
        email: 'defaultrole@example.com',
        password: 'password123',
      });

      expect(user.role).toBe('user');
    });

    it('should allow setting role to "admin"', async () => {
      const user = await User.create({
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });

      expect(user.role).toBe('admin');
    });
  });

  describe('Password select behavior', () => {
    it('should not return password by default', async () => {
      await User.create({
        username: 'selecttest',
        email: 'select@example.com',
        password: 'password123',
      });

      const user = await User.findOne({ username: 'selecttest' });

      expect(user).toBeDefined();
      expect(user?.password).toBeUndefined();
    });

    it('should return password when explicitly selected', async () => {
      await User.create({
        username: 'selectpasstest',
        email: 'selectpass@example.com',
        password: 'password123',
      });

      const user = await User.findOne({ username: 'selectpasstest' }).select('+password');

      expect(user).toBeDefined();
      expect(user?.password).toBeDefined();
      expect(user?.password).not.toBe('password123');
    });
  });
});
