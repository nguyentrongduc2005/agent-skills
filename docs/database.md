# Database

## Overview

The database uses PostgreSQL for persistent storage, managed via Prisma ORM.

## Storage Ownership

The database schemas, migrations, and structures are owned by the Prisma ORM migration tool. Prisma Client is generated under the `./generated/prisma` directory.

## Tables

### `users`

**Purpose**

Stores user credentials and profile information.

**Owner**

`PrismaUserRepository`

| Field          | Type           | Nullable | Default                | Description                                          |
| -------------- | -------------- | -------- | ---------------------- | ---------------------------------------------------- |
| `id`           | UUID           | No       | UUID generator         | Primary Key                                          |
| `email`        | Text           | No       | None                   | Unique login email address (normalized to lowercase) |
| `name`         | Varchar(100)   | No       | None                   | User's full display name                             |
| `passwordHash` | Text           | No       | None                   | Bcrypt password hash                                 |
| `createdAt`    | Timestamptz(3) | No       | `now()`                | Timestamp of account registration                    |
| `updatedAt`    | Timestamptz(3) | No       | `now()` (auto-updated) | Timestamp of last profile modification               |

**Keys and Relationships**

- Primary Key: `id` (UUID)

**Indexes and Constraints**

- Unique Index: `users_email_key` on `email` (unique constraint)
- Length Constraint: `VarChar(100)` on `name`

## Relationships

No foreign key relationships exist as `users` is currently the only table in the schema.

## Data Lifecycle

User profiles and credentials persist indefinitely. There is no automated cleanup, archival, or soft-deletion mechanism currently implemented.
