import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const renames = [
  [
    '20230810030240-create-transactions.js',
    '20230810030240-create-transactions.cjs',
  ],
  ['20230810035620-create-users.js', '20230810035620-create-users.cjs'],
  [
    '20230810035717-update-transactions.js',
    '20230810035717-update-transactions.cjs',
  ],
  [
    '20230904064630-add-daily-budget-to-users.js',
    '20230904064630-add-daily-budget-to-users.cjs',
  ],
];

const main = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  await client.connect();

  try {
    const tableCheck = await client.query(
      "SELECT to_regclass('public.\"SequelizeMeta\"') AS name"
    );

    if (!tableCheck.rows[0]?.name) {
      return;
    }

    for (const [oldName, newName] of renames) {
      const existing = await client.query(
        'SELECT name FROM "SequelizeMeta" WHERE name IN ($1, $2)',
        [oldName, newName]
      );

      const names = new Set(existing.rows.map(row => row.name));
      if (names.has(oldName) && names.has(newName)) {
        await client.query('DELETE FROM "SequelizeMeta" WHERE name = $1', [
          oldName,
        ]);
        continue;
      }

      if (names.has(oldName)) {
        await client.query(
          'UPDATE "SequelizeMeta" SET name = $2 WHERE name = $1',
          [oldName, newName]
        );
      }
    }
  } finally {
    await client.end();
  }
};

main().catch(error => {
  console.error('Failed to normalize SequelizeMeta migration names.', error);
  process.exit(1);
});
