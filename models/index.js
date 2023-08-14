import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import { env as _env } from 'process';
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';
import configModule from "../config/config.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const basename = _basename(__filename);
const env = _env.NODE_ENV || 'development';

// Since 'import' doesn't support dynamic paths, use 'import.meta.resolve' to get the full path

const config = configModule[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(_env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const modelFiles = readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

for (const file of modelFiles) {
  const modelPath = join(__dirname, file);
  const modelModule = await import(modelPath);
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
