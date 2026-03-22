# MiniBudget API

The backend API for the **MiniBudget** mobile application.
It provides authentication, transaction management, budgeting features, and a **production-grade bi-directional sync system** designed for offline-first mobile apps.

---

## Table of Contents
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Database & Migrations](#database--migrations)
- [API Sync System](#api-sync-system)
  - [Pull Sync](#pull-sync)
  - [Push Sync](#push-sync)
- [Testing & TDD](#testing--tdd)
- [Automated Deployment](#automated-deployment)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Endpoints Overview](#endpoints-overview)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User registration & authentication (JWT)
- Transaction CRUD (income & expenses)
- Daily / monthly budget tracking
- **Offline-first sync**
  - Incremental pull sync
  - Bi-directional push sync
  - Soft-delete aware
- Fully tested API (Mocha + Chai + Supertest)

---

## Architecture Overview

MiniBudget API is designed for **mobile clients that may be offline**.

Key principles:
- Server is **authoritative**
- Client sync is **idempotent**
- Deletions are **soft deletes**
- Sync is **incremental and resumable**

The API supports:
- Pulling only changed data since last sync
- Pushing creates, updates, and deletes from the client
- Safe retries without duplication

---

## Technologies Used
- Node.js (18+)
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Mocha, Chai, Supertest (testing)
- Swagger (API documentation)
- GitHub Actions (CI/CD)

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL
- Git
- Docker Desktop is the easiest local database path on this machine

---

### Installation
```bash
git clone [REPO_URL] minibudget-api
cd minibudget-api
npm install
````

---

### Environment Variables

Create a `.env` file at the project root:

```env
NODE_ENV=development
PORT=4000

JWT_SECRET=your_jwt_secret

DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=minibudget
DB_HOST=127.0.0.1
DB_DIALECT=postgres
```

---

### Running the Application

```bash
npm start
```

The server will start at:

```
http://localhost:4000
```

For the paired Android app running in the emulator, the frontend should point to:

```
http://10.0.2.2:4000
```

---

## Database & Migrations

### Creating a Migration

```bash
npm run migrate:create -- your-migration-name
```

> ⚠️ Note: This project uses **ESM**, but Sequelize CLI runs migrations as CommonJS.
> Newly created migrations are automatically renamed to `.cjs` for compatibility.

---

### Applying Migrations

```bash
npm run migrate
```

### Reverting the Last Migration

```bash
npm run migrate:undo
```

---

## API Sync System

MiniBudget implements a **v2 bi-directional sync protocol**.

### Pull Sync

Fetch all changes since the last successful sync.

```
GET /transactions/since/:timestamp
Authorization: Bearer <JWT>
```

#### Rules

* Inclusive sync:

  * `updatedAt >= since`
  * `deletedAt >= since`
* Soft-deleted records are included
* Results are ordered deterministically
* Response includes server time for next sync

#### Response

```json
{
  "transactions": [...],
  "serverTime": "2025-01-01T12:00:00.000Z"
}
```

Client should store `serverTime` and send it back as the next `since`.

---

### Push Sync

Push local client changes to the server.

```
POST /transactions/sync
Authorization: Bearer <JWT>
```

#### Payload

```json
{
  "transactions": [
    { "clientId": "local-1", ... },              // CREATE
    { "id": 12, ... },                            // UPDATE
    { "id": 13, "deletedAt": "2025-01-01T..." }  // DELETE
  ]
}
```

#### Response

```json
{
  "created": [{ "clientId": "local-1", "id": 42 }],
  "updated": [12],
  "deleted": [13]
}
```

#### Guarantees

* User-scoped
* Idempotent
* Safe to retry
* Server-authoritative

---

## Testing & TDD

This project follows a **test-first (TDD-style) workflow**.

### Tools

* Mocha
* Chai
* Supertest

### Running Tests

```bash
npm test
```

On Windows, this script is expected to set `NODE_ENV=test` before Mocha starts.

### Testing Philosophy

* Every endpoint is covered by integration tests
* Sync behavior is tested incrementally:

  1. Auth
  2. Empty responses
  3. Creates
  4. Updates
  5. Deletes
* Bugs are fixed by **adding tests first**, then code

This ensures confidence when refactoring sync logic.

---

## Automated Deployment

Deployment is handled via **GitHub Actions**.

### Required Secrets

* `SERVER_SSH_KEY`
* `SERVER_IP`
* `SERVER_USER`
* `SERVER_ENV_VARIABLES`

On each push to `main`:

1. Code is synced to the server
2. Environment variables are injected
3. Dependencies are installed
4. App is restarted using PM2

---

## API Documentation (Swagger)

Swagger documentation is auto-generated using `swagger-autogen`.

Access it at:

```
http://api.myminibudget.com/
```

Swagger UI is served directly by the Express app.

---

## Endpoints Overview

### Auth

* `POST /auth/login`

### Users

* `POST /users`
* `DELETE /users/:id`

### Transactions

* `GET /transactions`
* `POST /transactions`
* `PUT /transactions/:id`
* `DELETE /transactions/:id`

### Sync

* `GET /transactions/since/:timestamp`
* `POST /transactions/sync`

---

## Security

* JWT-based authentication
* Passwords hashed before storage
* User-scoped queries
* Soft deletes prevent data loss
* Input validation on all endpoints

---

## Contributing

Contributions are welcome.

Guidelines:

* Write tests for new behavior
* Follow existing sync rules
* Keep changes incremental
* Coordinate payload or auth-contract changes with the app repo

---

## License

MIT License
