import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;

const createUserAndToken = async suffix => {
  const username = `authz_${suffix}_${Date.now()}`;

  const userRes = await request(app).post('/users').send({
    username,
    password: 'password123',
  });

  const loginRes = await request(app).post('/auth/login').send({
    username,
    password: 'password123',
  });

  return {
    userId: userRes.body.id,
    token: loginRes.body.token,
  };
};

describe('Transactions API authorization', () => {
  let owner;
  let stranger;

  before(async () => {
    await sequelize.authenticate();
    owner = await createUserAndToken('owner');
    stranger = await createUserAndToken('stranger');
  });

  after(async () => {
    if (owner?.userId) {
      await request(app)
        .delete(`/users/${owner.userId}`)
        .set('Authorization', `Bearer ${owner.token}`);
    }

    if (stranger?.userId) {
      await request(app)
        .delete(`/users/${stranger.userId}`)
        .set('Authorization', `Bearer ${stranger.token}`);
    }
  });

  it('ignores spoofed userId on create and stores the authenticated owner', async () => {
    const createRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({
        date: new Date().toISOString(),
        amount: 55,
        type: 'expense',
        description: 'Spoof attempt',
        userId: stranger.userId,
      })
      .expect(201);

    expect(createRes.body.userId).to.equal(owner.userId);
  });

  it('does not let another user update someone else through sync push', async () => {
    const createRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({
        date: new Date().toISOString(),
        amount: 75,
        type: 'expense',
        description: 'Owner record',
      })
      .expect(201);

    await request(app)
      .post('/transactions/sync')
      .set('Authorization', `Bearer ${stranger.token}`)
      .send({
        transactions: [
          {
            id: createRes.body.id,
            date: new Date().toISOString(),
            amount: 999,
            type: 'expense',
            description: 'Stranger overwrite attempt',
          },
        ],
      })
      .expect(200);

    const ownerReadRes = await request(app)
      .get(`/transactions/${createRes.body.id}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .expect(200);

    expect(ownerReadRes.body.amount).to.equal('75.00');
    expect(ownerReadRes.body.description).to.equal('Owner record');
  });

  it('returns only the authenticated users transactions from sync pull', async () => {
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({
        date: new Date().toISOString(),
        amount: 11,
        type: 'expense',
        description: 'Owners pull record',
      })
      .expect(201);

    const strangerRes = await request(app)
      .get('/transactions/since/1970-01-01T00:00:00.000Z')
      .set('Authorization', `Bearer ${stranger.token}`)
      .expect(200);

    expect(strangerRes.body.transactions).to.be.an('array');
    expect(
      strangerRes.body.transactions.some(
        transaction => transaction.description === 'Owners pull record'
      )
    ).to.equal(false);
  });
});
