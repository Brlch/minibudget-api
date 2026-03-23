import { execSync } from 'child_process';

export async function runMigrations() {
  console.log('Running test DB migrations...');

  execSync('node ./scripts/normalize-migration-meta.mjs', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'test',
    },
  });

  execSync('npx sequelize-cli db:migrate', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'test',
    },
  });

  console.log('Test DB migrations completed');
}
