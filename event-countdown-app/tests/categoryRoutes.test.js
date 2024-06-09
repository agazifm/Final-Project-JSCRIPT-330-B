const request = require('supertest');
const app = require('../src/app'); // Adjust the path to your app entry point
const Category = require('../src/models/category');
const { setupDatabase, userOne, categoryOne } = require('./fixtures/db');

beforeEach(setupDatabase);

describe('Category Routes', () => {
  it('should create a new category', async () => {
    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({ name: 'New Category' })
      .expect(201);

    const category = await Category.findById(response.body._id);
    expect(category).toBeTruthy();
    expect(category.name).toBe('New Category');
  });

  it('should get all categories for a user', async () => {
    const response = await request(app)
      .get('/categories')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe(categoryOne.name);
  });

  it('should update a category', async () => {
    const response = await request(app)
      .patch(`/categories/${categoryOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({ name: 'Updated Category' })
      .expect(200);

    const category = await Category.findById(response.body._id);
    expect(category.name).toBe('Updated Category');
  });

  it('should delete a category and associated countdowns', async () => {
    await request(app)
      .delete(`/categories/${categoryOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    const category = await Category.findById(categoryOne._id);
    expect(category).toBeNull();
  });
});
