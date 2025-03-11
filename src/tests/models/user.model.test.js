const mongoose = require('mongoose');
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');

// Mock bcrypt to avoid actual hashing during tests
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to a test database before running tests
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/opinion-trading-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    // Disconnect from the test database after running tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clear the User collection after each test
    await User.deleteMany({});
  });

  it('should create a new user with default values', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Check that the user was saved correctly
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe('user'); // Default role
    expect(savedUser.balance).toBe(1000); // Default balance
    expect(savedUser.isActive).toBe(true); // Default active status
    
    // Check that password is hashed
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(savedUser.password).toBe('hashedPassword');
  });

  it('should validate required fields', async () => {
    const user = new User({});
    
    let error;
    try {
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should validate email format', async () => {
    const userData = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123'
    };

    const user = new User(userData);
    
    let error;
    try {
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should compare password correctly', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    // Test the comparePassword method
    const isMatch = await user.comparePassword('password123');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(isMatch).toBe(true);
  });

  it('should enforce unique username and email', async () => {
    // Create a user first
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    await new User(userData).save();

    // Try to create another user with the same username
    const duplicateUser = new User({
      username: 'testuser',
      email: 'another@example.com',
      password: 'password456'
    });

    // This should throw an error due to duplicate username
    await expect(duplicateUser.save()).rejects.toThrow();

    // Try to create another user with the same email
    const duplicateEmail = new User({
      username: 'anotheruser',
      email: 'test@example.com',
      password: 'password456'
    });

    // This should throw an error due to duplicate email
    await expect(duplicateEmail.save()).rejects.toThrow();
  });
}); 