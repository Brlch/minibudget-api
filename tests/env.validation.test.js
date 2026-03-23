import chai from 'chai';
import { getNodeEnv, validateRuntimeEnv } from '../config/env.js';

const { expect } = chai;

describe('Environment validation', () => {
  it('accepts valid local development settings', () => {
    const validated = validateRuntimeEnv({
      NODE_ENV: 'development',
      DB_USERNAME: 'minibudget',
      DB_PASSWORD: 'minibudget',
      DB_DATABASE: 'minibudget_test',
      DB_HOST: '127.0.0.1',
      JWT_SECRET: 'development-secret',
      PORT: '4000',
      DB_PORT: '5432',
    });

    expect(validated.nodeEnv).to.equal('development');
    expect(validated.dbPort).to.equal(5432);
    expect(validated.appPort).to.equal(4000);
    expect(validated.logTarget).to.equal('console');
  });

  it('rejects missing required variables', () => {
    expect(() =>
      validateRuntimeEnv({
        NODE_ENV: 'development',
        DB_USERNAME: 'minibudget',
        JWT_SECRET: 'development-secret',
      })
    ).to.throw(/missing required environment variables/i);
  });

  it('rejects placeholder jwt secrets in production', () => {
    expect(() =>
      validateRuntimeEnv({
        NODE_ENV: 'production',
        DB_USERNAME: 'minibudget',
        DB_PASSWORD: 'minibudget',
        DB_DATABASE: 'minibudget_prod',
        DB_HOST: 'db.example.com',
        JWT_SECRET: 'your_jwt_secret_key_here_change_in_production',
      })
    ).to.throw(/must be replaced/i);
  });

  it('rejects invalid node environments', () => {
    expect(() => getNodeEnv({ NODE_ENV: 'qa' })).to.throw(/invalid node_env/i);
  });

  it('rejects invalid log targets', () => {
    expect(() =>
      validateRuntimeEnv({
        NODE_ENV: 'development',
        DB_USERNAME: 'minibudget',
        DB_PASSWORD: 'minibudget',
        DB_DATABASE: 'minibudget_test',
        DB_HOST: '127.0.0.1',
        JWT_SECRET: 'development-secret',
        LOG_TARGET: 'papertrail',
      })
    ).to.throw(/invalid log_target/i);
  });
});
