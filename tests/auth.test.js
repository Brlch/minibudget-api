import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;

let testUserId;
let testUsername;

describe('Authentication API', () => {
  before(async () => {
    await sequelize.authenticate();

    testUsername = 'testuser_' + Date.now();

    const userResponse = await request(app)
      .post('/users')
      .send({
        username: testUsername,
        password: 'password123'
      });

    testUserId = userResponse.body.id;
  });

  after(async () => {
    if (testUserId) {
      await request(app).delete(`/users/${testUserId}`);
    }
  });

  it('should login a user and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: testUsername,
        password: 'password123'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('should not login a non-existent user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'nonExistentUser',
        password: 'randomPassword'
      });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property(
      'error',
      'Authentication failed. User not found.'
    );
  });

  it('should not login with an incorrect password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: testUsername,
        password: 'incorrectPassword'
      });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property(
      'error',
      'Authentication failed. Password is incorrect.'
    );
  });

  it('should not login with missing credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property(
      'error',
      'Username and password are required.'
    );
  });
});
