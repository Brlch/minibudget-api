// config/config.js

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'default_username',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_DATABASE || 'default_database',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DEV_PORT || 5432,
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USERNAME || 'default_username',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_DATABASE || 'default_database',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DEV_PORT || 5432,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USERNAME || 'default_username',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_DATABASE || 'default_database',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DEV_PORT || 5432,
    dialect: 'postgres'
  }
};
