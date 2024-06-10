const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, tearDownDatabase, userOneId } = require('./fixtures/db');
const Countdown = require('../src/models/countdown');

let userOneToken;
let category;
let countdown;

beforeEach(async () => {
  userOneToken = await setupDatabase();
  category = await Category.findOne({ owner: userOneId });
  countdown = await new Countdown({
    title: 'Existing Countdown',
    description: 'This is an existing countdown',
    date: new Date(),
    categoryId: category?._id,
    owner: userOneId,
  }).save();
  console.log('userOneToken in test:', userOneToken); // Log the token for debugging
});
afterEach(tearDownDatabase);

describe('Countdown Routes', () => {
  it('should create a new countdown', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    const response = await request(app)
      .post('/countdowns')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({
        title: 'New Countdown',
        description: 'This is a new countdown',
        date: new Date(),
        categoryId: category?._id.toString(),
      });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    countdown = response.body;
  });

  it('should get all countdowns', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    const response = await request(app)
      .get('/countdowns')
      .set('Authorization', `Bearer ${userOneToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should get a countdown by ID', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    if (!countdown || !countdown._id) {
      throw new Error('Countdown not found');
    }

    const response = await request(app)
      .get(`/countdowns/${countdown._id}`)
      .set('Authorization', `Bearer ${userOneToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should update a countdown', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    if (!countdown || !countdown._id) {
      throw new Error('Countdown not found');
    }

    const response = await request(app)
      .patch(`/countdowns/${countdown._id}`)
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({
        title: 'Updated Countdown',
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should delete a countdown', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    if (!countdown || !countdown._id) {
      throw new Error('Countdown not found');
    }

    const response = await request(app)
      .delete(`/countdowns/${countdown._id}`)
      .set('Authorization', `Bearer ${userOneToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should find the nearest event for a user', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    const response = await request(app)
      .get('/countdowns/aggregations/nearest-event')
      .set('Authorization', `Bearer ${userOneToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
