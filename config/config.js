// config/config.js (ESM version)

import dotenv from 'dotenv';
import { validateRuntimeEnv } from './env.js';
dotenv.config();

const { dbPort } = validateRuntimeEnv(process.env);

const baseConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: dbPort,
  dialect: 'postgres'
};

export default {
  development: {
    ...baseConfig
  },

  test: {
    ...baseConfig,
    logging: false
  },

  production: {
    ...baseConfig
  }
};
