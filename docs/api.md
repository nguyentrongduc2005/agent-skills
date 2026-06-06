# API

## Overview

The application provides a versioned JSON REST API under `/api/v1`. All requests and responses use the application/json MIME type.

## Base URL and Versioning

- **Base URL**: `http://localhost:3000` (configurable via `PORT` environment variable)
- **Version Prefix**: `/api/v1` (except the process health check which is at `/health`)

## Authentication

Endpoints requiring authentication accept a stateless JWT access token in the `Authorization` header using the Bearer schema:

`Authorization: Bearer <access-token>`

- **Access Token**: 15 minutes lifetime, signed with `JWT_ACCESS_SECRET`.
- **Refresh Token**: 7 days lifetime, signed with `JWT_REFRESH_SECRET`.

---

## Endpoints

### `POST /api/v1/auth/register`

**Purpose**

Register a new user account and issue an access and refresh token pair.

**Authentication**

None

**Request**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Jane Doe"
}
```

**Success Response**

- **Status Code**: `201 Created`
- **Body**:
  ```json
  {
    "data": {
      "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "name": "Jane Doe",
        "createdAt": "2026-06-06T00:00:00.000Z",
        "updatedAt": "2026-06-06T00:00:00.000Z"
      },
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
  ```

**Error Responses**

- **Status Code**: `400 Bad Request`
  - **Body**:
    ```json
    {
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Request validation failed",
        "details": [
          {
            "path": ["email"],
            "code": "invalid_string",
            "message": "Invalid email address"
          }
        ]
      }
    }
    ```
- **Status Code**: `409 Conflict`
  - **Body**:
    ```json
    {
      "error": {
        "code": "EMAIL_ALREADY_EXISTS",
        "message": "Email address already registered"
      }
    }
    ```

**Example**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Jane Doe"}'
```

---

### `POST /api/v1/auth/login`

**Purpose**

Authenticate user credentials and issue an access and refresh token pair.

**Authentication**

None

**Request**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response**

- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "data": {
      "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "name": "Jane Doe",
        "createdAt": "2026-06-06T00:00:00.000Z",
        "updatedAt": "2026-06-06T00:00:00.000Z"
      },
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
  ```

**Error Responses**

- **Status Code**: `400 Bad Request` (Validation error)
- **Status Code**: `401 Unauthorized`
  - **Body**:
    ```json
    {
      "error": {
        "code": "INVALID_CREDENTIALS",
        "message": "Invalid email or password"
      }
    }
    ```

**Example**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

### `POST /api/v1/auth/refresh`

**Purpose**

Exchange a valid refresh token for a new access token and refresh token pair.

**Authentication**

None (token passed in request body)

**Request**

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Success Response**

- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "data": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
  ```

**Error Responses**

- **Status Code**: `400 Bad Request` (Validation error)
- **Status Code**: `401 Unauthorized`
  - **Body**:
    ```json
    {
      "error": {
        "code": "AUTHENTICATION_REQUIRED",
        "message": "Authentication is required to access this resource"
      }
    }
    ```

**Example**

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-jwt-refresh-token"}'
```

---

### `GET /api/v1/auth/me`

**Purpose**

Retrieve the profile of the currently authenticated user.

**Authentication**

Bearer Access Token

**Request**

None

**Success Response**

- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "data": {
      "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "name": "Jane Doe",
        "createdAt": "2026-06-06T00:00:00.000Z",
        "updatedAt": "2026-06-06T00:00:00.000Z"
      }
    }
  }
  ```

**Error Responses**

- **Status Code**: `401 Unauthorized`
  - **Body**:
    ```json
    {
      "error": {
        "code": "AUTHENTICATION_REQUIRED",
        "message": "Authentication is required to access this resource"
      }
    }
    ```

**Example**

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer your-jwt-access-token"
```

---

### `GET /health`

**Purpose**

Process health check.

**Authentication**

None

**Request**

None

**Success Response**

- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "status": "ok"
  }
  ```

**Error Responses**

None

**Example**

```bash
curl -X GET http://localhost:3000/health
```

---

## Error Contract

All endpoint errors return a consistent envelope shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Description of the error",
    "details": []
  }
}
```

### Standard Error Codes

| HTTP Status | Error Code                | Description                                                   |
| ----------- | ------------------------- | ------------------------------------------------------------- |
| 400         | `VALIDATION_ERROR`        | The request body validation failed (Zod schema mismatch).     |
| 401         | `AUTHENTICATION_REQUIRED` | Authentication failed, token is missing, expired, or invalid. |
| 401         | `INVALID_CREDENTIALS`     | Invalid email or password provided during login.              |
| 409         | `EMAIL_ALREADY_EXISTS`    | The email address is already registered to another user.      |
| 404         | `NOT_FOUND`               | The requested resource or route does not exist.               |
| 500         | `INTERNAL_SERVER_ERROR`   | An unexpected server-side error occurred.                     |
