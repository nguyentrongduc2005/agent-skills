# JWT Authentication API

A secure, fully-tested REST API built with Node.js, Express, TypeScript, and Prisma ORM, utilizing PostgreSQL for persistence.

## Prerequisites

- **Node.js**: `v24` or higher
- **npm**: `v11` or higher
- **Docker & Docker Compose**: For local PostgreSQL database provisioning

---

## Getting Started

### 1. Configure Environment Variables

Copy the provided example environment files:

```bash
# Copy development configuration
cp .env.example .env

# Copy test configuration (used for unit/integration tests)
cp .env.test.example .env.test
```

> [!NOTE]
> The application startup loads `.env` by default, whereas test scripts explicitly load `.env.test` using `dotenv-cli`.

### 2. Start PostgreSQL Database

Spin up the local PostgreSQL database using Docker Compose:

```bash
docker compose up -d
```

This starts a container with two databases:

- `jwt_auth` (Development)
- `jwt_auth_test` (Isolated testing)

### 3. Install Dependencies

Install all package dependencies:

```bash
npm install
```

### 4. Run Schema Migrations and Client Generation

Sync the database schemas with the Prisma model definition and generate the TypeScript Prisma client:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations on development database
npm run prisma:migrate:dev -- --name init

# Deploy migrations to test database
npm run db:test:migrate
```

### 5. Start the Server

Run the development server with live reload:

```bash
npm run dev
```

The server will start listening on port `3000` (or the `PORT` specified in your `.env`).

---

## Commands Reference

- `npm run dev`: Start development server with file watch
- `npm run build`: Compile TypeScript codebase to JavaScript in `dist/`
- `npm run start`: Run the compiled server from `dist/`
- `npm run typecheck`: Run TypeScript compiler type check (`noEmit`)
- `npm run lint`: Run ESLint to analyze code style and quality
- `npm run format`: Format code files with Prettier
- `npm run format:check`: Verify formatting of files
- `npm run test:unit`: Run Vitest unit tests
- `npm run test:integration`: Run Vitest PostgreSQL-backed HTTP integration tests
- `npm run test`: Run both unit and integration tests
- `npm run verify`: Format, lint, type-check, and run all tests

To safely shut down the local database:

```bash
docker compose down
```

---

## API Contract & Usage Examples

All API requests and responses use JSON format. The API is versioned under `/api/v1`.

### 1. Register User

- **Endpoint**: `POST /api/v1/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Jane Doe"
  }
  ```

**Example Curl**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com", "password":"password123", "name":"Jane Doe"}'
```

### 2. Log In

- **Endpoint**: `POST /api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

**Example Curl**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com", "password":"password123"}'
```

### 3. Exchange Refresh Token

Exchanges a valid refresh token for a new access token and refresh token.

- **Endpoint**: `POST /api/v1/auth/refresh`
- **Body**:
  ```json
  {
    "refreshToken": "<your-refresh-token>"
  }
  ```

**Example Curl**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<your-refresh-token>"}'
```

### 4. Retrieve Profile

Retrieves the authenticated user's profile. Requires a Bearer Access Token.

- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <access-token>`

**Example Curl**:

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer <your-access-token>"
```

### 5. Health Check

Basic health check endpoint independent of database queries.

- **Endpoint**: `GET /health`

**Example Curl**:

```bash
curl -X GET http://localhost:3000/health
```

---

## Token Lifetimes & Limits

- **Access Token**: Expires after **15 minutes** (configured via `JWT_ACCESS_EXPIRES_IN`).
- **Refresh Token**: Expires after **7 days** (configured via `JWT_REFRESH_EXPIRES_IN`).
- **Limitation**: Refresh tokens are stateless. They cannot be revoked, and previously issued refresh tokens remain valid until their expiration date.
