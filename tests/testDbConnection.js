import Sequelize from 'sequelize';
import '../config.js'; 

// Create and export a new Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres', // assuming 'postgres' as default
    logging: false, // Disable logging for tests
  }
);

export default sequelize;
