const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const name = process.argv[2];
if (!name) {
  console.error('❌ Migration name required');
  process.exit(1);
}

execSync(`npx sequelize-cli migration:generate --name ${name}`, {
  stdio: 'inherit',
});

const migrationsDir = path.resolve('migrations');
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.includes(name) && f.endsWith('.js'));

if (files.length !== 1) {
  console.error('❌ Could not uniquely identify migration file');
  process.exit(1);
}

const oldPath = path.join(migrationsDir, files[0]);
const newPath = oldPath.replace(/\.js$/, '.cjs');

fs.renameSync(oldPath, newPath);
console.log(`✅ Migration renamed to ${path.basename(newPath)}`);
