import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;

let userId;
let token;
let username;

describe('Transactions Sync API (push)', () => {
  before(async () => {
    await sequelize.authenticate();

    username = 'syncpush_' + Date.now();

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
      .post('/transactions/sync')
      .send({ transactions: [] })
      .expect(401);
  });

  it('should accept and create transactions from sync push', async () => {
    const payload = {
      transactions: [
        {
          clientId: 'local-1',
          date: new Date().toISOString(),
          amount: 42,
          type: 'expense',
          description: 'Pushed from client',
        },
      ],
    };

    const res = await request(app)
      .post('/transactions/sync')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    expect(res.body).to.have.property('created');
    expect(res.body.created).to.be.an('array');
    expect(res.body.created.length).to.equal(1);

    expect(res.body.created[0]).to.have.property('clientId', 'local-1');
    expect(res.body.created[0]).to.have.property('id');
  });

  it('should update existing transactions from sync push', async () => {
    // create initial transaction on server
    const createRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: new Date().toISOString(),
        amount: 10,
        type: 'expense',
        description: 'Original',
        userId,
      });

    const serverId = createRes.body.id;

    // push update
    const payload = {
      transactions: [
        {
          id: serverId,
          date: new Date().toISOString(),
          amount: 99,
          type: 'expense',
          description: 'Updated from client',
        },
      ],
    };

    const res = await request(app)
      .post('/transactions/sync')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    expect(res.body).to.have.property('updated');
    expect(res.body.updated).to.include(serverId);
  });

  it('should delete existing transactions from sync push', async () => {
    // create initial transaction on server
    const createRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: new Date().toISOString(),
        amount: 15,
        type: 'expense',
        description: 'To be deleted via sync',
        userId,
      });

    const serverId = createRes.body.id;

    // push delete
    const payload = {
      transactions: [
        {
          id: serverId,
          deletedAt: new Date().toISOString(),
        },
      ],
    };

    const res = await request(app)
      .post('/transactions/sync')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    expect(res.body).to.have.property('deleted');
    expect(res.body.deleted).to.include(serverId);
  });

  it('should reject updates with stale updatedAt (conflict)', async () => {
    // create transaction on server
    const createRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: new Date().toISOString(),
        amount: 20,
        type: 'expense',
        description: 'Server version',
        userId,
      });

    const serverTx = createRes.body;

    // simulate stale client update
    const payload = {
      transactions: [
        {
          id: serverTx.id,
          amount: 999,
          type: 'expense',
          description: 'Stale client update',
          updatedAt: new Date(Date.now() - 60_000).toISOString(), // older
        },
      ],
    };

    const res = await request(app)
      .post('/transactions/sync')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    expect(res.body).to.have.property('conflicts');
    expect(res.body.conflicts).to.include(serverTx.id);
  });

});
