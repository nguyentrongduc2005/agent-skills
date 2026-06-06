# Architecture

## Overview

This project implements a clean, layered architectural design pattern for a Node.js Express REST API using TypeScript. System responsibilities are segregated into thin controllers, a business service logic layer, a data persistence repository layer, and shared helper middlewares.

## System Context

The JWT Auth backend exposes versioned HTTP REST endpoints to client applications, authenticates requests using JWT tokens, normalizes/validates payloads, and persists user record data in a PostgreSQL database.

## Modules and Services

| Component                              | Responsibility                                                | Depends On                                                | Owns                          |
| -------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------- |
| `src/server.ts`                        | Process entry point & graceful shutdown handling              | `src/app.ts`, `src/config/env.ts`, `src/config/prisma.ts` | Process lifetime              |
| `src/app.ts`                           | Composition Root, Express app configuration                   | Middlewares, Auth routes                                  | App pipeline                  |
| `src/config/env.ts`                    | Environment validation & parsing                              | `zod`                                                     | Safe configuration            |
| `src/config/prisma.ts`                 | Database adapter configuration & Prisma Client initialization | `pg`, `@prisma/adapter-pg`, `src/config/env.ts`           | Database connection client    |
| `src/modules/users/user.repository.ts` | DB operations for users                                       | Prisma Client, `src/modules/users/user.types.ts`          | `users` database table access |
| `src/modules/auth/token.service.ts`    | JWT signing, verification, and decoding                       | `jsonwebtoken`, `src/config/env.ts`                       | Token generation              |
| `src/modules/auth/auth.service.ts`     | Auth business rules (register, login, refresh, profile)       | `UserRepository`, `TokenService`, `bcrypt`                | Auth core business logic      |
| `src/modules/auth/auth.controller.ts`  | HTTP request/response translations                            | `AuthService`                                             | Auth endpoint entrypoints     |
| `src/modules/auth/auth.routes.ts`      | Auth route paths & middleware setup                           | `AuthController`, validation & auth middlewares           | Auth endpoint routing         |

## Boundaries and Ownership

- **HTTP Layer**: Controllers and routes are isolated from database details. They translate incoming payloads, trigger business logic, and serialize responses.
- **Business Logic Layer**: `AuthService` handles authentication workflows and token generation, but delegates data storage query details to the repository interface.
- **Persistence Layer**: `PrismaUserRepository` handles SQL query actions, translating database-specific errors into domain errors.

## Component Relationships

The flow of a request follows this chain:

```text
HTTP Request -> Express Router -> Middleware -> Controller -> AuthService -> TokenService & UserRepository -> Prisma Pg Adapter -> PostgreSQL
```

## Data Flow

### Registration Flow

1.  Client registers via `POST /api/v1/auth/register`.
2.  `validateBody` middleware parses and normalizes input data.
3.  `AuthController` delegates validated inputs to `AuthService`.
4.  `AuthService` hashes the password with `bcrypt` and creates the record in `UserRepository`.
5.  `UserRepository` executes Prisma query, mapping database constraint errors to domain exceptions.
6.  `AuthService` triggers `TokenService` to sign access/refresh token pair.
7.  Mapped public user data and token strings are serialized back in a JSON payload.
