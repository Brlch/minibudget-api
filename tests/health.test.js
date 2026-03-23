import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import db from '../models/index.js';

const { expect } = chai;

describe('Health API', () => {
  it('returns service health information with a request id', async () => {
    const res = await request(app).get('/health');

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('ok');
    expect(res.body.service).to.equal('minibudget-api');
    expect(res.body.time).to.be.a('string');
    expect(res.headers).to.have.property('x-request-id');
    expect(res.headers['x-request-id']).to.match(/^req-\d+$/);
  });

  it('returns a passing readiness check when the database is available', async () => {
    const res = await request(app).get('/health/ready');

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('ok');
    expect(res.body.checks).to.deep.equal({
      config: 'ok',
      database: 'ok',
      migrations: 'ok'
    });
  });

  it('returns degraded readiness when the database check fails', async () => {
    const originalAuthenticate = db.sequelize.authenticate.bind(db.sequelize);
    db.sequelize.authenticate = async () => {
      throw new Error('db down');
    };

    const res = await request(app).get('/health/ready');

    expect(res.status).to.equal(503);
    expect(res.body.status).to.equal('degraded');
    expect(res.body.checks).to.deep.equal({
      config: 'ok',
      database: 'unavailable',
      migrations: 'unknown'
    });

    db.sequelize.authenticate = originalAuthenticate;
  });
});
