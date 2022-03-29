const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  it('should be able to create/sign up a user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'Toby', password: 'spoon' });
    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'Toby',
      password: 'spoon',
    });
  });
});
