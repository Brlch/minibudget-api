import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;

let token;
let userId;

describe('JWT Middleware', () => {
  before(async () => {
    await sequelize.authenticate();

    const username = 'jwtuser_' + Date.now();

    const userRes = await request(app)
      .post('/users')
      .send({
        username,
        password: 'password123'
      });

    userId = userRes.body.id;

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        username,
        password: 'password123'
      });

    token = loginRes.body.token;
  });

  after(async () => {
    if (userId) {
      await request(app).delete(`/users/${userId}`);
    }
  });

  it('should allow access with a valid token', async () => {
    const res = await request(app)
      .get('/test/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Access granted');
    expect(res.body).to.have.property('userId');
  });

  it('should reject request with no token', async () => {
    const res = await request(app).get('/test/protected');

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property(
      'error',
      'Missing authorization header.'
    );
  });

  it('should reject malformed authorization header', async () => {
    const res = await request(app)
      .get('/test/protected')
      .set('Authorization', 'BadTokenFormat');

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property(
      'error',
      'Malformed authorization header.'
    );
  });

  it('should reject invalid token', async () => {
    const res = await request(app)
      .get('/test/protected')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).to.equal(403);
    expect(res.body).to.have.property(
      'error',
      'Invalid or expired token.'
    );
  });
});
