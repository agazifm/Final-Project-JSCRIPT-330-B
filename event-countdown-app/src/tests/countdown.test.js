const request = require('supertest');
const app = require('../app');
const Countdown = require('../models/countdown');

beforeEach(async () => {
  await Countdown.deleteMany();
  // Add initial setup if needed
});

describe('Countdown Endpoints', () => {
  it('should create a new countdown', async () => {
    const res = await request(app)
      .post('/countdowns')
      .send({
        title: 'Test Event',
        description: 'This is a test event',
        date: '2023-12-31T23:59:59Z'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Event');
  });

  // Add more tests for CRUD operations
});
