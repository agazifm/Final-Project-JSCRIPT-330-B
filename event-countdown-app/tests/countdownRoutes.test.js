const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, tearDownDatabase, userOneToken } = require('./fixtures/db');

beforeEach(setupDatabase);
afterEach(tearDownDatabase);

describe('Countdown Routes', () => {
  let countdown;

  it('should create a new countdown', async () => {
    const response = await request(app)
     .post('/countdowns')
     .set('Authorization', `Bearer ${userOneToken}`)
     .send({
        title: 'New Countdown',
        description: 'This is a new countdown',
        date: new Date(),
        categoryId: 'categoryId',
      });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    countdown = response.body;
  });

  it('should get all countdowns', async () => {
    const response = await request(app)
     .get('/countdowns')
     .set('Authorization', `Bearer ${userOneToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should get a countdown by ID', async () => {
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
    const response = await request(app)
    .get('/countdowns/aggregations/nearest-event')
    .set('Authorization', `Bearer ${userOneToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});