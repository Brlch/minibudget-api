// config/config.js (ESM version)

import dotenv from 'dotenv';
dotenv.config();

const baseConfig = {
  username: process.env.DB_USERNAME || 'default_username',
  password: process.env.DB_PASSWORD || 'default_password',
  database: process.env.DB_DATABASE || 'default_database',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DEV_PORT || 5432,
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
