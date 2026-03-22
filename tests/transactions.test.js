import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;

let userId;
let transactionId;
let token;
let username;

describe('Transactions API', () => {
  before(async () => {
    await sequelize.authenticate();

    username = 'testuser_' + Date.now();

    const userResponse = await request(app)
      .post('/users')
      .send({
        username,
        password: 'password123'
      });

    userId = userResponse.body.id;

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        username,
        password: 'password123'
      });

    token = loginResponse.body.token;
  });

  after(async () => {
    if (userId) {
      await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    }
  });

  it('should POST a new transaction', async () => {
    const res = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2023-08-09T15:45:00.000Z',
        amount: 100,
        type: 'income',
        description: 'Test income',
        userId
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');

    transactionId = res.body.id;
  });

  it('should UPDATE the created transaction', async () => {
    const res = await request(app)
      .put(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 200,
        description: 'Updated Test income'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      'message',
      'Transaction updated successfully'
    );
  });

  it('should GET all transactions', async () => {
    const res = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should GET all transactions for a user', async () => {
    const res = await request(app)
      .get(`/transactions/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');

    res.body.forEach(tx => {
      expect(tx.userId).to.equal(userId);
    });
  });

  it('should DELETE the transaction', async () => {
    const res = await request(app)
      .delete(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      'message',
      'Transaction deleted successfully'
    );
  });
});
