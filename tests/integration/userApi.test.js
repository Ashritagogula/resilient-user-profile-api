const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('User API Integration Tests', () => {
  beforeAll(async () => {
    // connectDB from app.js might try to connect based on .env
    // ensure MONGO_URI is set or mock db connection if needed.
    // For this example, we assume it connects to a test db.
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test User');
  });

  it('should return 409 for duplicate email', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'duplicate@example.com' });
    
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Another User', email: 'duplicate@example.com' });
      
    expect(res.statusCode).toEqual(409);
    expect(res.body.errorCode).toBe('EMAIL_CONFLICT');
  });

  it('should validate inputs', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: '', email: 'invalid-email' });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.errorCode).toBe('VALIDATION_ERROR');
  });

  // Test graceful degradation
  it('should gracefully degrade when enrichment service is down', async () => {
    const originalUrl = process.env.ENRICHMENT_SERVICE_URL;
    process.env.ENRICHMENT_SERVICE_URL = 'http://localhost:9999/dead-end';
    
    // We also need to recreate the UserService or controller?
    // Wait, the UserService in userController is created OUTSIDE the request scope.
    // So changing process.env here won't affect the already instantiated UserService.
    // Instead, we can mock axios just for this test, or use nock.
    // Let's use jest.spyOn on axios.
    const axios = require('axios');
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Network Error'));

    const createUser = await request(app)
      .post('/api/users')
      .send({ name: 'Fallback User', email: 'fallback@example.com' });
      
    const userId = createUser.body.id || createUser.body._id;
    
    const res = await request(app)
      .get(`/api/users/${userId}/enriched`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.enrichedDataStatus).toBe('unavailable');
    expect(res.body.enrichedData).toBeNull();
    
    axios.get.mockRestore();
  });
});
