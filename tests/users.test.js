import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;

describe('Users API', () => {
  let createdUserId;
  let testUsername;
  let token;

  before(async () => {
    await sequelize.authenticate();
  });

  it('should POST a new user', async () => {
    testUsername = 'testUser_' + Date.now();

    const res = await request(app)
      .post('/users')
      .send({
        username: testUsername,
        password: 'testPass123'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('username', testUsername);

    createdUserId = res.body.id;
  });

  it('should login the new user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: testUsername,
        password: 'testPass123'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');

    token = res.body.token;
  });

  it('should GET the created user by ID', async () => {
    const res = await request(app)
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('username', testUsername);
  });

  it('should UPDATE the user', async () => {
    const res = await request(app)
      .put(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updatedUser'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      'message',
      'User updated successfully'
    );
  });

  it('should reject access to another user profile', async () => {
    const otherUsername = 'otherUser_' + Date.now();

    const createRes = await request(app)
      .post('/users')
      .send({
        username: otherUsername,
        password: 'testPass123'
      });

    const res = await request(app)
      .get(`/users/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(403);
  });

  it('should DELETE the user even when transactions exist', async () => {
    const txRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2024-01-01T00:00:00.000Z',
        amount: 50,
        type: 'expense',
        description: 'Cleanup check'
      });

    expect(txRes.status).to.equal(201);

    const res = await request(app)
      .delete(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it('should return not found for the deleted user', async () => {
    const res = await request(app)
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(404);
  });
});
