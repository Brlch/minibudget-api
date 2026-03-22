import { runMigrations } from './setup.js';

before(async function () {
  this.timeout(20000); // migrations can be slow on first run
  await runMigrations();
});
