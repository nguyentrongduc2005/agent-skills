import { describe, it, expect } from "vitest";
import { parseEnv } from "../../src/config/env.js";

describe("env configuration parsing", () => {
  const validMinInput = {
    DATABASE_URL: "postgresql://localhost:5432/db",
    JWT_ACCESS_SECRET: "access-secret-must-be-long-enough-for-security-reasons",
    JWT_REFRESH_SECRET:
      "refresh-secret-must-be-long-enough-for-security-reasons",
  };

  it("should parse valid minimal configuration and apply defaults", () => {
    const config = parseEnv(validMinInput);
    expect(config.databaseUrl).toBe(validMinInput.DATABASE_URL);
    expect(config.jwtAccessSecret).toBe(validMinInput.JWT_ACCESS_SECRET);
    expect(config.jwtRefreshSecret).toBe(validMinInput.JWT_REFRESH_SECRET);
    expect(config.port).toBe(3000);
    expect(config.jwtAccessExpiresIn).toBe("15m");
    expect(config.jwtRefreshExpiresIn).toBe("7d");
    expect(config.bcryptSaltRounds).toBe(12);
  });

  it("should accept custom valid values", () => {
    const config = parseEnv({
      ...validMinInput,
      PORT: "8080",
      JWT_ACCESS_EXPIRES_IN: "30m",
      JWT_REFRESH_EXPIRES_IN: "30d",
      BCRYPT_SALT_ROUNDS: "8",
    });
    expect(config.port).toBe(8080);
    expect(config.jwtAccessExpiresIn).toBe("30m");
    expect(config.jwtRefreshExpiresIn).toBe("30d");
    expect(config.bcryptSaltRounds).toBe(8);
  });

  it("should reject missing required fields", () => {
    expect(() =>
      parseEnv({
        JWT_ACCESS_SECRET: validMinInput.JWT_ACCESS_SECRET,
        JWT_REFRESH_SECRET: validMinInput.JWT_REFRESH_SECRET,
      }),
    ).toThrow();

    expect(() =>
      parseEnv({
        DATABASE_URL: validMinInput.DATABASE_URL,
        JWT_REFRESH_SECRET: validMinInput.JWT_REFRESH_SECRET,
      }),
    ).toThrow();

    expect(() =>
      parseEnv({
        DATABASE_URL: validMinInput.DATABASE_URL,
        JWT_ACCESS_SECRET: validMinInput.JWT_ACCESS_SECRET,
      }),
    ).toThrow();
  });

  it("should reject identical access and refresh secrets", () => {
    expect(() =>
      parseEnv({
        ...validMinInput,
        JWT_ACCESS_SECRET: "same-secret-for-both",
        JWT_REFRESH_SECRET: "same-secret-for-both",
      }),
    ).toThrow();
  });

  it("should reject invalid port numbers", () => {
    expect(() =>
      parseEnv({
        ...validMinInput,
        PORT: "invalid-port",
      }),
    ).toThrow();

    expect(() =>
      parseEnv({
        ...validMinInput,
        PORT: "-1",
      }),
    ).toThrow();

    expect(() =>
      parseEnv({
        ...validMinInput,
        PORT: "999999",
      }),
    ).toThrow();
  });

  it("should reject invalid bcrypt salt rounds", () => {
    expect(() =>
      parseEnv({
        ...validMinInput,
        BCRYPT_SALT_ROUNDS: "3", // below 4
      }),
    ).toThrow();

    expect(() =>
      parseEnv({
        ...validMinInput,
        BCRYPT_SALT_ROUNDS: "16", // above 15
      }),
    ).toThrow();

    expect(() =>
      parseEnv({
        ...validMinInput,
        BCRYPT_SALT_ROUNDS: "invalid",
      }),
    ).toThrow();
  });

  it("should reject empty expiry strings", () => {
    expect(() =>
      parseEnv({
        ...validMinInput,
        JWT_ACCESS_EXPIRES_IN: "",
      }),
    ).toThrow();

    expect(() =>
      parseEnv({
        ...validMinInput,
        JWT_REFRESH_EXPIRES_IN: "",
      }),
    ).toThrow();
  });
});
