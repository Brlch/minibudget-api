# Production Readiness

## Goal

Run `minibudget-api` as a safe production backend for account login and cloud transaction sync.

## Phase 1

### Auth and session lifecycle

- [x] JWT login
- [ ] Define production token lifetime and refresh strategy
- [ ] Support password reset
- [ ] Support account deletion lifecycle from the app
- [ ] Return stable auth error shapes for expired or invalid sessions

### Environment and config

- [x] Separate local, staging, and production config foundation
- [x] Validate required env vars at boot
- [x] Document production DB, JWT, and CORS requirements

### Observability

- [x] Structured request/error logging foundation
- [x] Health endpoint and uptime checks foundation
- [ ] Alerting for auth and sync failures

## Phase 2

### Sync contract hardening

- [x] User-scoped sync routes
- [x] Integration coverage for create, update, delete, and authorization
- [ ] Input validation for transaction payload shape
- [ ] Conflict response coverage for more edge cases
- [ ] Idempotency strategy for duplicate sync submissions

### Data safety

- [ ] Backup and restore plan
- [ ] Migration deploy procedure
- [ ] Retention and deletion policy

## Phase 3

### Deployment

- [ ] Managed PostgreSQL
- [ ] Production hosting
- [ ] HTTPS and reverse proxy setup
- [ ] Rate limiting and abuse protection
- [ ] Staging environment
- [x] Release checklist foundation

## Current Priority

1. Add real backend alerting and external log aggregation.
2. Stand up staging and verify `/health/ready` there.
3. Add deploy-safe migration and rollback procedures.
