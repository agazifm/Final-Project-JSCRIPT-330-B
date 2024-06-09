const request = require('supertest');
const app = require('../src/app'); // Adjust the path to your app entry point
const Countdown = require('../src/models/countdown');
const { setupDatabase, userOne, countdownOne } = require('./fixtures/db');

beforeEach(setupDatabase);

describe('Countdown Routes', () => {
  it('should create a new countdown', async () => {
    const response = await request(app)
      .post('/countdowns')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        title: 'New Countdown',
        description: 'Description for new countdown',
        date: new Date()
      })
      .expect(201);

    const countdown = await Countdown.findById(response.body._id);
    expect(countdown).toBeTruthy();
    expect(countdown.title).toBe('New Countdown');
  });

  it('should get all countdowns for a user', async () => {
    const response = await request(app)
      .get('/countdowns')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe(countdownOne.title);
  });

  it('should get the nearest event for a user', async () => {
    const response = await request(app)
      .get('/countdowns/aggregations/nearest-event')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body.title).toBe(countdownOne.title);
  });

  it('should update a countdown', async () => {
    const response = await request(app)
      .patch(`/countdowns/${countdownOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({ title: 'Updated Countdown' })
      .expect(200);

    const countdown = await Countdown.findById(response.body._id);
    expect(countdown.title).toBe('Updated Countdown');
  });

  it('should delete a countdown', async () => {
    await request(app)
      .delete(`/countdowns/${countdownOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    const countdown = await Countdown.findById(countdownOne._id);
    expect(countdown).toBeNull();
  });
});
