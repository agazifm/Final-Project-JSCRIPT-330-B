const request = require('supertest');
const app = require('../app');
const Category = require('../models/category');

beforeEach(async () => {
  await Category.deleteMany();
  // Add initial setup if needed
});

describe('Category Endpoints', () => {
  it('should create a new category', async () => {
    const res = await request(app)
      .post('/categories')
      .send({
        name: 'Test Category'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Category');
  });

  // Add more tests for CRUD operations
});
