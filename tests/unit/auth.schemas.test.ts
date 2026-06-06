import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../../src/modules/auth/auth.schemas.js";

describe("auth schemas validation", () => {
  describe("registerSchema", () => {
    it("should parse and normalize valid registration data", () => {
      const input = {
        email: "  USER@example.COM  ",
        name: "  Jane Doe  ",
        password: "password123",
      };
      const result = registerSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          email: "user@example.com",
          name: "Jane Doe",
          password: "password123",
        });
      }
    });

    it("should reject name that is empty or only whitespace", () => {
      expect(
        registerSchema.safeParse({
          email: "user@example.com",
          name: "",
          password: "password123",
        }).success,
      ).toBe(false);
      expect(
        registerSchema.safeParse({
          email: "user@example.com",
          name: "   ",
          password: "password123",
        }).success,
      ).toBe(false);
    });

    it("should reject name exceeding 100 characters", () => {
      const longName = "a".repeat(101);
      expect(
        registerSchema.safeParse({
          email: "user@example.com",
          name: longName,
          password: "password123",
        }).success,
      ).toBe(false);
    });

    it("should reject invalid email formats", () => {
      expect(
        registerSchema.safeParse({
          email: "invalid-email",
          name: "Jane Doe",
          password: "password123",
        }).success,
      ).toBe(false);
    });

    it("should enforce password constraints (8 to 72 bytes)", () => {
      expect(
        registerSchema.safeParse({
          email: "user@example.com",
          name: "Jane",
          password: "1234567",
        }).success,
      ).toBe(false);

      expect(
        registerSchema.safeParse({
          email: "user@example.com",
          name: "Jane",
          password: "12345678",
        }).success,
      ).toBe(true);

      const validMultibyte = "🚀".repeat(18); // 18 * 4 = 72 bytes
      expect(
        registerSchema.safeParse({
          email: "user@example.com",
          name: "Jane",
          password: validMultibyte,
        }).success,
      ).toBe(true);

      const invalidMultibyte = "🚀".repeat(19); // 19 * 4 = 76 bytes (exceeds 72)
      expect(
        registerSchema.safeParse({
          email: "user@example.com",
          name: "Jane",
          password: invalidMultibyte,
        }).success,
      ).toBe(false);
    });

    it("should reject unknown fields", () => {
      const input = {
        email: "user@example.com",
        name: "Jane Doe",
        password: "password123",
        extra: "unwanted-field",
      };
      expect(registerSchema.safeParse(input).success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("should parse and normalize valid login data", () => {
      const input = {
        email: "  USER@example.COM  ",
        password: "password123",
      };
      const result = loginSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          email: "user@example.com",
          password: "password123",
        });
      }
    });

    it("should reject unknown fields", () => {
      const input = {
        email: "user@example.com",
        password: "password123",
        extra: "unwanted-field",
      };
      expect(loginSchema.safeParse(input).success).toBe(false);
    });
  });

  describe("refreshSchema", () => {
    it("should parse valid refresh data", () => {
      const input = {
        refreshToken: "some-jwt-token-string",
      };
      const result = refreshSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject empty refresh token", () => {
      expect(refreshSchema.safeParse({ refreshToken: "" }).success).toBe(false);
    });

    it("should reject unknown fields", () => {
      const input = {
        refreshToken: "some-jwt-token-string",
        extra: "unwanted-field",
      };
      expect(refreshSchema.safeParse(input).success).toBe(false);
    });
  });
});
