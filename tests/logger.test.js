import chai from 'chai';
import { logger } from '../utils/logger.js';

const { expect } = chai;

describe('logger utility', () => {
  const originalTarget = process.env.LOG_TARGET;
  const originalExternalLogger = globalThis.__MINIBUDGET_API_LOG__;

  afterEach(() => {
    if (typeof originalTarget === 'undefined') {
      delete process.env.LOG_TARGET;
    } else {
      process.env.LOG_TARGET = originalTarget;
    }

    if (typeof originalExternalLogger === 'undefined') {
      delete globalThis.__MINIBUDGET_API_LOG__;
    } else {
      globalThis.__MINIBUDGET_API_LOG__ = originalExternalLogger;
    }
  });

  it('forwards logs to an external logger when configured', () => {
    const calls = [];
    process.env.LOG_TARGET = 'external';
    globalThis.__MINIBUDGET_API_LOG__ = payload => {
      calls.push(payload);
    };

    logger.error('test.external', {
      requestId: 'req-1',
    });

    expect(calls).to.have.length(1);
    expect(calls[0]).to.include({
      level: 'error',
      message: 'test.external',
      requestId: 'req-1',
    });
  });
});
