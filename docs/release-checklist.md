# Release Checklist

## Verification

- [ ] `npm run verify` passes
- [ ] `/health/live` returns `200`
- [ ] `/health/ready` returns healthy in the target environment
- [ ] Request logs include `X-Request-Id` values

## Environment

- [ ] `NODE_ENV`, DB settings, JWT secret, and CORS origins are set correctly
- [ ] Production secrets are not placeholders
- [ ] Database backups are current
- [ ] Migrations have been applied in the target environment

## Auth And Sync

- [ ] Signup works from the app
- [ ] Login works from the app
- [ ] Sync push succeeds
- [ ] Sync pull succeeds
- [ ] Expired-token handling is still correct from the app

## Final Go/No-Go

- [ ] Error monitoring is receiving backend failures
- [ ] Rollback procedure is documented and available
- [ ] Previous stable deploy artifact is available
