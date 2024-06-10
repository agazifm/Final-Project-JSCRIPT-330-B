const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, tearDownDatabase, userOneId } = require('./fixtures/db');
const Category = require('../src/models/category');

let userOneToken;
let category;

beforeEach(async () => {
  userOneToken = await setupDatabase();
  category = await Category.findOne({ owner: userOneId });
  console.log('userOneToken in test:', userOneToken); // Log the token for debugging
});
afterEach(tearDownDatabase);

describe('Category Routes', () => {
  it('should create a new category', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({
        name: 'New Category',
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'New Category',
      owner: userOneId.toString(),
    });
  });

  it('should get all categories', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    const response = await request(app)
      .get('/categories')
      .set('Authorization', `Bearer ${userOneToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should update a category', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    const newCategory = await new Category({ name: 'Category to Update', owner: userOneId }).save();

    const response = await request(app)
      .patch(`/categories/${newCategory._id}`)
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({
        name: 'Updated Category',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: 'Updated Category',
      owner: userOneId.toString(),
    });
  });

  it('should delete a category', async () => {
    if (!userOneToken) {
      throw new Error('userOneToken is not defined');
    }
    const newCategory = await new Category({ name: 'Category to Delete', owner: userOneId }).save();

    const response = await request(app)
      .delete(`/categories/${newCategory._id}`)
      .set('Authorization', `Bearer ${userOneToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
