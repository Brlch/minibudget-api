import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';

process.env.NODE_ENV = 'test';

const { default: app } = await import('../index.js');

const evidenceDir = path.join(process.cwd(), 'evidences');

const main = async () => {
  await rm(evidenceDir, { recursive: true, force: true });
  await mkdir(evidenceDir, { recursive: true });

  const username = `evidence_${Date.now()}`;
  const password = 'password123';

  const userRes = await request(app).post('/users').send({
    username,
    password,
  });

  const loginRes = await request(app).post('/auth/login').send({
    username,
    password,
  });

  const token = loginRes.body.token;
  const userId = userRes.body.id;

  const syncCreateRes = await request(app)
    .post('/transactions/sync')
    .set('Authorization', `Bearer ${token}`)
    .send({
      transactions: [
        {
          id: 'evidence-client-1',
          date: '2026-03-22T11:00:00.000Z',
          amount: -12.5,
          type: 'expense',
          category: 'Evidence',
          description: 'API evidence flow',
          updatedAt: '2026-03-22T11:00:00.000Z',
        },
      ],
    });

  const serverId = syncCreateRes.body.created[0]?.id;

  const pullRes = await request(app)
    .get('/transactions/since/1970-01-01T00:00:00.000Z')
    .set('Authorization', `Bearer ${token}`);

  const evidence = {
    generatedAt: new Date().toISOString(),
    user: {
      id: userId,
      username,
    },
    login: {
      status: loginRes.status,
      tokenPreview: `${token.slice(0, 10)}...${token.slice(-6)}`,
    },
    syncCreate: {
      status: syncCreateRes.status,
      body: syncCreateRes.body,
    },
    pull: {
      status: pullRes.status,
      transaction: pullRes.body.transactions.find(
        transaction => transaction.id === serverId
      ),
      serverTime: pullRes.body.serverTime,
    },
  };

  await writeFile(
    path.join(evidenceDir, 'sync-contract.json'),
    JSON.stringify(evidence, null, 2),
    'utf8'
  );

  await request(app)
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${token}`);
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
