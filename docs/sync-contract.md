# Sync Contract

## Purpose

This document describes the expected sync contract between `minibudget-api` and
the Expo app in `myminibudget`.

## Auth Boundary

- `POST /users` creates a new account
- `POST /auth/login` returns a JWT
- Sync endpoints require `Authorization: Bearer <jwt>`
- Offline bypass is a frontend-only mode and must not hit the API

## Canonical Transaction Fields

- `id`
- `date`
- `amount`
- `type`
- `description`
- `updatedAt`
- `deletedAt`

The app may also track `syncStatus` locally, but that field is client state and
is not authoritative on the server.

## Pull Sync

Endpoint:

```http
GET /transactions/since/:timestamp
```

Response:

```json
{
  "transactions": [],
  "serverTime": "2026-03-22T00:00:00.000Z"
}
```

Rules:

- results are user-scoped
- records changed by `updatedAt` or `deletedAt` since the provided timestamp are returned
- soft-deleted rows are included
- `serverTime` is the client's next sync anchor

## Push Sync

Endpoint:

```http
POST /transactions/sync
```

Request body:

```json
{
  "transactions": []
}
```

Response body:

```json
{
  "created": [{ "clientId": "local-1", "id": 42 }],
  "updated": [42],
  "deleted": [43],
  "conflicts": [44]
}
```

Rules:

- non-numeric IDs are treated as client-created records
- numeric IDs are treated as server records
- stale client updates are returned in `conflicts`
- server remains authoritative during conflicts

## Coordination Notes

- if this payload shape changes, the app repo must be updated in the same slice
- if conflict semantics change, the app sync UI and tests must also change
- `date` remains canonical; do not reintroduce `datetime` as a server field
