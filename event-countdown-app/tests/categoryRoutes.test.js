const request = require('supertest');
const app = require('../src/app');

const { setupDatabase, tearDownDatabase, userOneToken, category } = require('./fixtures/db');

beforeEach(setupDatabase);
afterEach(tearDownDatabase);

describe('Category Routes', () => {
  it('should create a new category', async () => {
    const response = await request(app)
     .post('/categories')
     .set('Authorization', `Bearer ${userOneToken}`)
     .send({
        name: 'New Category',
      });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
  });

  it('should get all categories', async () => {
    constresponse = await request(app)
     .get('/categories')
     .set('Authorization', `Bearer ${userOneToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should update a category', async () => {
    if (!category || !category._id) {
      throw new Error('Category not found');
    }
  
    const response = await request(app)
     .patch(`/categories/${category._id}`)
     .set('Authorization', `Bearer ${userOneToken}`)
     .send({
        name: 'Updated Category',
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should delete a category', async () => {
    if (!category || !category._id) {
      throw new Error('Category not found');
    }
  
    const response = await request(app)
     .delete(`/categories/${category._id}`)
     .set('Authorization', `Bearer ${userOneToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});