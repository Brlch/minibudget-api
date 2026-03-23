import express from 'express';
import db from '../models/index.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

const buildBasePayload = () => ({
  service: 'minibudget-api',
  time: new Date().toISOString()
});

const hasMigrationMetadata = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  return tables
    .map(table => (typeof table === 'string' ? table : table.tableName))
    .includes('SequelizeMeta');
};

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    ...buildBasePayload()
  });
});

router.get('/live', (_req, res) => {
  res.json({
    status: 'ok',
    ...buildBasePayload()
  });
});

router.get('/ready', async (_req, res) => {
  try {
    await db.sequelize.authenticate();
    const migrations = await hasMigrationMetadata();

    res.json({
      status: migrations ? 'ok' : 'degraded',
      checks: {
        config: 'ok',
        database: 'ok',
        migrations: migrations ? 'ok' : 'missing_metadata'
      },
      ...buildBasePayload()
    });
  } catch (error) {
    logger.error('health.ready_failed', {
      message: error instanceof Error ? error.message : String(error)
    });

    res.status(503).json({
      status: 'degraded',
      checks: {
        config: 'ok',
        database: 'unavailable',
        migrations: 'unknown'
      },
      ...buildBasePayload()
    });
  }
});

export default router;
