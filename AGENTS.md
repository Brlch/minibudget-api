# Agent Notes

## Project Status

- Repo role: backend API for My Mini Budget
- Current state: local JWT auth and bi-directional transaction sync are working
- Current branch for upcoming coordinated work: `codex/account-sync-foundation`
- Main was updated with a sync/test-harness stabilization pass

## Paired Frontend Repo

- Frontend repo path: `C:\Users\brlch\repos\myminibudget`
- Android emulator app points to this API through `http://10.0.2.2:4000`

## Core API Behavior

- Auth:
  - `POST /users` creates an account
  - `POST /auth/login` returns a JWT
- Transactions:
  - all transaction routes are user-scoped
  - sync pull: `GET /transactions/since/:timestamp`
  - sync push: `POST /transactions/sync`
- Transactions use soft delete with `deletedAt`
- Server is authoritative during sync conflicts

## Important Backend Decisions

- Tests run as integration tests against a real Postgres database
- `index.js` avoids calling `listen()` when `NODE_ENV=test`
- CORS allows production origins plus local Expo/dev origins
- User deletion now deletes that user's transactions first so cleanup and tests succeed cleanly
- User profile reads and writes are self-scoped

## Verification

- Main verification command:

```powershell
npm test
```

- Current expected result: all tests passing

## Local Database Workflow

1. Start Docker Desktop.
2. Start the existing local Postgres container:

```powershell
docker start minibudget-postgres
```

3. If the container does not exist yet, create it once:

```powershell
docker run -d --name minibudget-postgres `
  -e POSTGRES_USER=minibudget `
  -e POSTGRES_PASSWORD=minibudget `
  -e POSTGRES_DB=minibudget_test `
  -p 5432:5432 postgres:15
```

4. Run:

```powershell
npm test
npm start
```

## Environment Notes

- `.env` is expected to provide DB credentials and `JWT_SECRET`
- The current local setup uses:
  - `DB_USERNAME=minibudget`
  - `DB_PASSWORD=minibudget`
  - `DB_DATABASE=minibudget_test`
  - `DB_HOST=127.0.0.1`
  - `PORT=4000`

## Known Gotchas

- This repo uses ESM, but Sequelize CLI migrations are kept as `.cjs`
- On Windows, the test script must set `NODE_ENV` as:

```powershell
set "NODE_ENV=test" && npx mocha "tests/**/*.test.js" --timeout 10000 --exit
```

- If tests suddenly fail with `EADDRINUSE` on port `4000`, check that `NODE_ENV=test` is actually being set
- If sync work changes payload shape, coordinate the contract change with the app repo immediately

## Good Next Areas

- add explicit sync conflict response coverage if the contract evolves
- harden input validation for transactions and users
- keep local dev and emulator flows easy while preserving production-safe defaults
