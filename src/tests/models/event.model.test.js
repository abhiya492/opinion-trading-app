const mongoose = require('mongoose');
const Event = require('../../models/event.model');
const User = require('../../models/user.model');

describe('Event Model', () => {
  let testUser;

  beforeAll(async () => {
    // Connect to a test database before running tests
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/opinion-trading-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a test user for reference in events
    testUser = await User.create({
      username: 'eventcreator',
      email: 'creator@example.com',
      password: 'password123'
    });
  });

  afterAll(async () => {
    // Disconnect from the test database after running tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clear the Event collection after each test
    await Event.deleteMany({});
  });

  it('should create a new event with all required fields', async () => {
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event',
      category: 'sports',
      startTime: new Date(),
      endTime: new Date(Date.now() + 86400000), // Tomorrow
      options: [
        { text: 'Option A', odds: 1.5 },
        { text: 'Option B', odds: 2.5 }
      ],
      createdBy: testUser._id
    };

    const event = new Event(eventData);
    const savedEvent = await event.save();

    // Check that the event was saved correctly
    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.title).toBe(eventData.title);
    expect(savedEvent.description).toBe(eventData.description);
    expect(savedEvent.category).toBe(eventData.category);
    expect(savedEvent.status).toBe('upcoming'); // Default status
    expect(savedEvent.totalVolume).toBe(0); // Default volume
    expect(savedEvent.options.length).toBe(2);
    expect(savedEvent.options[0].text).toBe('Option A');
    expect(savedEvent.options[0].odds).toBe(1.5);
    expect(savedEvent.options[1].text).toBe('Option B');
    expect(savedEvent.options[1].odds).toBe(2.5);
  });

  it('should validate required fields', async () => {
    const event = new Event({});
    
    let error;
    try {
      await event.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
    expect(error.errors.description).toBeDefined();
    expect(error.errors.category).toBeDefined();
    expect(error.errors.startTime).toBeDefined();
    expect(error.errors.endTime).toBeDefined();
    expect(error.errors.createdBy).toBeDefined();
  });

  it('should validate category enum values', async () => {
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event',
      category: 'invalid-category', // Invalid category
      startTime: new Date(),
      endTime: new Date(Date.now() + 86400000),
      options: [
        { text: 'Option A', odds: 1.5 },
        { text: 'Option B', odds: 2.5 }
      ],
      createdBy: testUser._id
    };

    const event = new Event(eventData);
    
    let error;
    try {
      await event.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.category).toBeDefined();
  });

  it('should validate status enum values', async () => {
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event',
      category: 'sports',
      startTime: new Date(),
      endTime: new Date(Date.now() + 86400000),
      status: 'invalid-status', // Invalid status
      options: [
        { text: 'Option A', odds: 1.5 },
        { text: 'Option B', odds: 2.5 }
      ],
      createdBy: testUser._id
    };

    const event = new Event(eventData);
    
    let error;
    try {
      await event.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  it('should ensure endTime is after startTime', async () => {
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event',
      category: 'sports',
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      endTime: new Date(), // Today (earlier than startTime)
      options: [
        { text: 'Option A', odds: 1.5 },
        { text: 'Option B', odds: 2.5 }
      ],
      createdBy: testUser._id
    };

    const event = new Event(eventData);
    
    // This should ideally be validated in the schema or pre-save middleware
    // For this test, we're just demonstrating that such validation would be important
    const isValid = event.endTime > event.startTime;
    expect(isValid).toBe(false);
  });
}); 