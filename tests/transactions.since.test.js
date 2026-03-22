import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;

let userId;
let token;
let username;

describe('Transactions Sync API (since)', () => {
  before(async () => {
    await sequelize.authenticate();

    username = 'syncuser_' + Date.now();

    const userRes = await request(app)
      .post('/users')
      .send({
        username,
        password: 'password123',
      });

    userId = userRes.body.id;

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        username,
        password: 'password123',
      });

    token = loginRes.body.token;
  });

  after(async () => {
    if (userId) {
      await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    }
  });

  it('should require auth', async () => {
    await request(app)
      .get('/transactions/since/2025-01-01T00:00:00.000Z')
      .expect(401);
  });

  it('should reject invalid timestamp', async () => {
    await request(app)
      .get('/transactions/since/not-a-date')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('should return empty list when nothing changed', async () => {
    const res = await request(app)
      .get('/transactions/since/2099-01-01T00:00:00.000Z')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).to.have.property('transactions');
    expect(res.body.transactions).to.be.an('array').that.is.empty;
    expect(res.body).to.have.property('serverTime');
  });
  it('should return transactions updated after timestamp', async () => {
    // create a transaction
    const txRes = await request(app)
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
        date: new Date().toISOString(),
        amount: 50,
        type: 'expense',
        description: 'Sync test',
        userId,
        });

    const txId = txRes.body.id;

    // sync from the past
    const since = new Date(Date.now() - 60_000).toISOString();

    const res = await request(app)
        .get(`/transactions/since/${since}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    expect(res.body.transactions.length).to.equal(1);
    expect(res.body.transactions[0].id).to.equal(txId);
    });

    it('should include deleted transactions in sync', async () => {
    // create
    const txRes = await request(app)
    .post('/transactions')
    .set('Authorization', `Bearer ${token}`)
    .send({
        date: new Date().toISOString(),
        amount: 30,
        type: 'expense',
        description: 'To be deleted',
        userId,
    });

    const txId = txRes.body.id;

    // 🔴 capture BEFORE delete
    const since = new Date().toISOString();

    // delete
    await request(app)
    .delete(`/transactions/${txId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

    // sync
    const res = await request(app)
    .get(`/transactions/since/${since}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

    const deletedTx = res.body.transactions.find(tx => tx.id === txId);

    expect(deletedTx).to.exist;
    expect(deletedTx.deletedAt).to.not.be.null;

    });

});

