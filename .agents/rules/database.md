# Database Rules

> Apply when changing schemas, migrations, persistence models, queries,
> transactions, or data lifecycle behavior.

## Database

- Engine and version: {{DATABASE_ENGINE_AND_VERSION}}
- Migration tool: {{MIGRATION_TOOL}}
- Migration location: `{{MIGRATION_PATH}}`
- Schema documentation: `{{DATABASE_DOC_PATH}}`

## Schema Design

- Table naming: {{TABLE_NAMING_CONVENTION}}
- Column naming: {{COLUMN_NAMING_CONVENTION}}
- Primary key strategy: {{PRIMARY_KEY_STRATEGY}}
- Timestamp strategy: {{TIMESTAMP_STRATEGY}}
- Soft-delete policy: {{SOFT_DELETE_POLICY}}
- Store timestamps in {{DATABASE_TIMEZONE}}.
- Use constraints for critical invariants.
- Add indexes based on verified access patterns.
- Do not store secrets or plaintext passwords.

## Migrations

- Every schema change uses a migration.
- Applied migrations are immutable.
- Naming format: `{{MIGRATION_NAMING_FORMAT}}`
- Migrations must be deterministic and safe for
  {{DEPLOYMENT_MIGRATION_MODEL}}.
- Destructive migration process: {{DESTRUCTIVE_MIGRATION_PROCESS}}
- Seed data policy: {{SEED_DATA_POLICY}}

## Queries and Transactions

- Prevent unbounded queries and N+1 behavior.
- Fetch only fields required by the use case when practical.
- Transaction owner: {{TRANSACTION_OWNER_LAYER}}
- Isolation policy: {{TRANSACTION_ISOLATION_POLICY}}
- Locking policy: {{LOCKING_POLICY}}

## Compatibility

- Rolling deployment policy: {{ROLLING_DEPLOYMENT_POLICY}}
- Large backfills must be resumable.
- Define rollback or forward-fix behavior before destructive changes.

## Testing

- Test environment: {{DATABASE_TEST_ENVIRONMENT}}
- Verify constraints, indexes, defaults, and migration behavior.
- Verification command: `{{DATABASE_TEST_COMMAND}}`

## Review Checklist

- [ ] Migration and persistence model agree.
- [ ] Constraints enforce required invariants.
- [ ] Query and index impact were considered.
- [ ] Sensitive data is protected.
- [ ] Compatibility and deployment order are clear.
