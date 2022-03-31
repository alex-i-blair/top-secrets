const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to create/sign up a user', async () => {
    const res = await request(app)
      .post('/api/v1/users/')
      .send({ username: 'Toby', password: 'spoon' });
    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'Toby',
    });
  });

  it('should sign in an existing user', async () => {
    const user = await UserService.create({
      username: 'Toby',
      password: 'spoon',
    });
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ username: 'Toby', password: 'spoon' });

    expect(res.body).toEqual({
      message: 'Sign in successful',
      user,
    });
  });

  it('should be able to log out a logged in user', async () => {
    const res = await request(app).delete('/api/v1/users/sessions');
    expect(res.body).toEqual({
      success: true,
      message: 'Sign out successful',
    });
  });

  it('should be able to create a secret as logged in user', async () => {
    const agent = request.agent(app);

    await UserService.create({
      username: 'Toby',
      password: 'spoon',
    });
    await agent.post('/api/v1/users/sessions').send({
      username: 'Toby',
      password: 'spoon',
    });
    return await agent
      .post('/api/v1/secrets')
      .send({
        title: 'dog',
        description: 'Toby is the best dog',
      })
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          title: 'dog',
          description: 'Toby is the best dog',
          createdAt: expect.any(String),
        });
      });
  });

  it('should return a list of secrets for a logged in user', async () => {
    const agent = request.agent(app);

    //if no logged in user
    let res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(401);

    await UserService.create({
      username: 'Toby',
      password: 'spoon',
    });
    await agent.post('/api/v1/users/sessions').send({
      username: 'Toby',
      password: 'spoon',
    });

    await agent.post('/api/v1/secrets').send({
      title: 'dog',
      description: 'Toby is the best dog',
    });

    const expected = [
      {
        title: 'dog',
        description: 'Toby is the best dog',
        createdAt: expect.any(String),
      },
    ];
    res = await agent.get('/api/v1/secrets');
    expect(res.body).toEqual(expected);
  });
});
