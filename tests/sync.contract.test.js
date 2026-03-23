import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;

describe('Sync contract end to end', () => {
  let userId;
  let token;
  let username;

  before(async () => {
    await sequelize.authenticate();

    username = `contract_${Date.now()}`;

    const userRes = await request(app).post('/users').send({
      username,
      password: 'password123',
    });

    userId = userRes.body.id;

    const loginRes = await request(app).post('/auth/login').send({
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

  it('creates, updates, and returns a synced transaction with the expected shape', async () => {
    const createPayload = {
      transactions: [
        {
          id: 'client-seed-1',
          date: '2026-03-22T10:00:00.000Z',
          amount: -15.5,
          type: 'expense',
          category: 'Coffee',
          description: 'Morning coffee',
          updatedAt: '2026-03-22T10:00:00.000Z',
        },
      ],
    };

    const createRes = await request(app)
      .post('/transactions/sync')
      .set('Authorization', `Bearer ${token}`)
      .send(createPayload)
      .expect(200);

    expect(createRes.body.created).to.have.length(1);
    const serverId = createRes.body.created[0].id;

    const updatePayload = {
      transactions: [
        {
          id: serverId,
          date: '2026-03-22T10:00:00.000Z',
          amount: -17.25,
          type: 'expense',
          category: 'Coffee',
          description: 'Morning coffee with tip',
          updatedAt: new Date(Date.now() + 5_000).toISOString(),
        },
      ],
    };

    const updateRes = await request(app)
      .post('/transactions/sync')
      .set('Authorization', `Bearer ${token}`)
      .send(updatePayload)
      .expect(200);

    expect(updateRes.body.updated).to.include(serverId);

    const sinceRes = await request(app)
      .get('/transactions/since/1970-01-01T00:00:00.000Z')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const synced = sinceRes.body.transactions.find(
      transaction => transaction.id === serverId
    );

    expect(synced).to.include({
      id: serverId,
      type: 'expense',
      category: 'Coffee',
      description: 'Morning coffee with tip',
    });
    expect(synced.amount).to.equal('-17.25');
    expect(synced).to.have.property('date');
    expect(synced).to.have.property('updatedAt');
    expect(sinceRes.body).to.have.property('serverTime');
  });

  it('returns deleted transactions in pull results after a sync delete', async () => {
    const createRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: new Date().toISOString(),
        amount: 9,
        type: 'expense',
        category: 'Cleanup',
        description: 'Delete me',
      })
      .expect(201);

    const syncDeleteRes = await request(app)
      .post('/transactions/sync')
      .set('Authorization', `Bearer ${token}`)
      .send({
        transactions: [
          {
            id: createRes.body.id,
            deletedAt: new Date().toISOString(),
          },
        ],
      })
      .expect(200);

    expect(syncDeleteRes.body.deleted).to.include(createRes.body.id);

    const sinceRes = await request(app)
      .get('/transactions/since/1970-01-01T00:00:00.000Z')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const deletedTx = sinceRes.body.transactions.find(
      transaction => transaction.id === createRes.body.id
    );

    expect(deletedTx).to.exist;
    expect(deletedTx.deletedAt).to.not.equal(null);
  });
});
