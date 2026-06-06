import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { prisma } from "../../src/config/prisma.js";
import bcrypt from "bcrypt";

interface ApiResponse {
  data?: {
    user?: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
    accessToken?: string;
    refreshToken?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

describe("auth REST API integration tests", () => {
  const app = createApp();

  describe("POST /api/v1/auth/register", () => {
    it("should successfully register a user with normalized email, create password hash, and return user + tokens", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "  Jane.Doe@Example.com  ",
          name: "  Jane Doe  ",
          password: "password123",
        })
        .expect(201);

      const body = res.body as ApiResponse;
      expect(body.data?.user?.email).toBe("jane.doe@example.com");
      expect(body.data?.user?.name).toBe("Jane Doe");
      expect(body.data?.user?.id).toBeDefined();
      expect("passwordHash" in (body.data?.user ?? {})).toBe(false);
      expect(body.data?.accessToken).toBeDefined();
      expect(body.data?.refreshToken).toBeDefined();

      const userInDb = await prisma.user.findUnique({
        where: { email: "jane.doe@example.com" },
      });
      expect(userInDb).toBeDefined();
      expect(userInDb!.name).toBe("Jane Doe");
      expect(userInDb!.passwordHash).not.toBe("password123");
      const matched = await bcrypt.compare(
        "password123",
        userInDb!.passwordHash,
      );
      expect(matched).toBe(true);
    });

    it("should reject duplicate email and case-variant email with 409 Conflict", async () => {
      await request(app).post("/api/v1/auth/register").send({
        email: "dup@example.com",
        name: "User 1",
        password: "password123",
      });

      const resDup = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "dup@example.com",
          name: "User 2",
          password: "password123",
        })
        .expect(409);

      expect(resDup.body as ApiResponse).toEqual({
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "Email address already registered",
        },
      });

      const resCaseDup = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "DUP@example.com",
          name: "User 3",
          password: "password123",
        })
        .expect(409);

      expect(resCaseDup.body as ApiResponse).toEqual({
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "Email address already registered",
        },
      });
    });

    it("should reject invalid fields with 400 VALIDATION_ERROR", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "invalid-email",
          name: "   ",
          password: "short",
        })
        .expect(400);

      const body = res.body as ApiResponse;
      expect(body.error?.code).toBe("VALIDATION_ERROR");
      expect(body.error?.message).toBe("Request validation failed");
      expect(body.error?.details).toBeDefined();
      expect(body.error?.details?.length).toBe(3);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/v1/auth/register").send({
        email: "login@example.com",
        name: "Login User",
        password: "password123",
      });
    });

    it("should successfully log in with valid credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "login@example.com",
          password: "password123",
        })
        .expect(200);

      const body = res.body as ApiResponse;
      expect(body.data?.user?.email).toBe("login@example.com");
      expect(body.data?.accessToken).toBeDefined();
      expect(body.data?.refreshToken).toBeDefined();
    });

    it("should reject wrong password with 401 INVALID_CREDENTIALS", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "login@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(res.body as ApiResponse).toEqual({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    });

    it("should reject login with non-existent user email with 401 INVALID_CREDENTIALS", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "notfound@example.com",
          password: "password123",
        })
        .expect(401);

      expect(res.body as ApiResponse).toEqual({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    let refreshToken: string;
    let accessToken: string;

    beforeEach(async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        email: "refresh@example.com",
        name: "Refresh User",
        password: "password123",
      });
      const body = res.body as ApiResponse;
      refreshToken = body.data?.refreshToken ?? "";
      accessToken = body.data?.accessToken ?? "";
    });

    it("should return a new pair of tokens when a valid refresh token is exchanged", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      const body = res.body as ApiResponse;
      expect(body.data?.accessToken).toBeDefined();
      expect(body.data?.refreshToken).toBeDefined();
      expect(body.data?.accessToken).not.toBe(accessToken);
    });

    it("should reject an access token passed to the refresh endpoint with 401 AUTHENTICATION_REQUIRED", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: accessToken })
        .expect(401);

      const body = res.body as ApiResponse;
      expect(body.error?.code).toBe("AUTHENTICATION_REQUIRED");
    });

    it("should reject an expired or invalid refresh token with 401 AUTHENTICATION_REQUIRED", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "invalid-token" })
        .expect(401);

      const body = res.body as ApiResponse;
      expect(body.error?.code).toBe("AUTHENTICATION_REQUIRED");
    });
  });

  describe("GET /api/v1/auth/me", () => {
    let accessToken: string;
    let refreshToken: string;
    let userId: string;

    beforeEach(async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        email: "me@example.com",
        name: "Me User",
        password: "password123",
      });
      const body = res.body as ApiResponse;
      accessToken = body.data?.accessToken ?? "";
      refreshToken = body.data?.refreshToken ?? "";
      userId = body.data?.user?.id ?? "";
    });

    it("should return the public user profile for a valid access token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      const body = res.body as ApiResponse;
      expect(body.data?.user?.email).toBe("me@example.com");
      expect(body.data?.user?.name).toBe("Me User");
      expect(body.data?.user?.id).toBe(userId);
      expect("passwordHash" in (body.data?.user ?? {})).toBe(false);
    });

    it("should reject a request with no auth header with 401 AUTHENTICATION_REQUIRED", async () => {
      const res = await request(app).get("/api/v1/auth/me").expect(401);

      const body = res.body as ApiResponse;
      expect(body.error?.code).toBe("AUTHENTICATION_REQUIRED");
    });

    it("should reject a request with a malformed auth header with 401 AUTHENTICATION_REQUIRED", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer")
        .expect(401);

      const body = res.body as ApiResponse;
      expect(body.error?.code).toBe("AUTHENTICATION_REQUIRED");
    });

    it("should reject a request with a refresh token passed as Bearer token with 401 AUTHENTICATION_REQUIRED", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${refreshToken}`)
        .expect(401);

      const body = res.body as ApiResponse;
      expect(body.error?.code).toBe("AUTHENTICATION_REQUIRED");
    });
  });

  describe("Unknown routes", () => {
    it("should return 404 NOT_FOUND for unknown routes", async () => {
      const res = await request(app).get("/api/v1/unknown-route").expect(404);

      expect(res.body as ApiResponse).toEqual({
        error: {
          code: "NOT_FOUND",
          message: "Resource not found",
        },
      });
    });
  });
});
