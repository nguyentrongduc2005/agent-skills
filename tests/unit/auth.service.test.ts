import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AuthService } from "../../src/modules/auth/auth.service.js";
import { TokenService } from "../../src/modules/auth/token.service.js";
import {
  CreateUserInput,
  DuplicateEmailError,
  UserRepository,
} from "../../src/modules/users/user.types.js";
import { User } from "../../generated/prisma/client.js";
import { AppError } from "../../src/shared/errors/app-error.js";
import bcrypt from "bcrypt";

class FakeUserRepository implements UserRepository {
  public users: User[] = [];

  create(input: CreateUserInput): Promise<User> {
    const exists = this.users.some((u) => u.email === input.email);
    if (exists) {
      return Promise.reject(new DuplicateEmailError());
    }
    const user: User = {
      id: `uuid-${this.users.length + 1}`,
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.email === email) || null);
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.id === id) || null);
  }
}

describe("AuthService", () => {
  let userRepository: FakeUserRepository;
  let tokenService: TokenService;
  let authService: AuthService;

  beforeEach(() => {
    vi.useFakeTimers();
    userRepository = new FakeUserRepository();
    tokenService = new TokenService(
      "access-secret-key-1234567890-must-be-long",
      "refresh-secret-key-1234567890-must-be-long",
      "15m",
      "7d",
    );
    authService = new AuthService(userRepository, tokenService, 4);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("register", () => {
    it("should successfully register a user, hash password, and return user without passwordHash plus token pair", async () => {
      const result = await authService.register({
        email: "register@example.com",
        name: "Register User",
        password: "password123",
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe("register@example.com");
      expect(result.user.name).toBe("Register User");
      expect(result.user.id).toBeDefined();
      expect("passwordHash" in result.user).toBe(false);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const createdUser = userRepository.users[0];
      expect(createdUser).toBeDefined();
      expect(createdUser!.email).toBe("register@example.com");
      expect(createdUser!.passwordHash).not.toBe("password123");
      const isPasswordMatched = await bcrypt.compare(
        "password123",
        createdUser!.passwordHash,
      );
      expect(isPasswordMatched).toBe(true);
    });

    it("should map DuplicateEmailError to 409 EMAIL_ALREADY_EXISTS", async () => {
      await authService.register({
        email: "duplicate@example.com",
        name: "User 1",
        password: "password123",
      });

      await expect(
        authService.register({
          email: "duplicate@example.com",
          name: "User 2",
          password: "password123",
        }),
      ).rejects.toThrowError(
        new AppError(
          409,
          "EMAIL_ALREADY_EXISTS",
          "Email address already registered",
        ),
      );
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      await authService.register({
        email: "login@example.com",
        name: "Login User",
        password: "password123",
      });
    });

    it("should successfully login with valid credentials", async () => {
      const result = await authService.login({
        email: "login@example.com",
        password: "password123",
      });

      expect(result.user.email).toBe("login@example.com");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should reject login with wrong password with 401 INVALID_CREDENTIALS", async () => {
      await expect(
        authService.login({
          email: "login@example.com",
          password: "wrongpassword",
        }),
      ).rejects.toThrowError(
        new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password"),
      );
    });

    it("should reject login with non-existent email with 401 INVALID_CREDENTIALS", async () => {
      await expect(
        authService.login({
          email: "notfound@example.com",
          password: "password123",
        }),
      ).rejects.toThrowError(
        new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password"),
      );
    });
  });

  describe("refresh", () => {
    it("should return a new pair of tokens for a valid refresh token", async () => {
      const registerResult = await authService.register({
        email: "refresh@example.com",
        name: "Refresh User",
        password: "password123",
      });

      vi.advanceTimersByTime(2000);

      const refreshResult = await authService.refresh(
        registerResult.refreshToken,
      );
      expect(refreshResult.accessToken).toBeDefined();
      expect(refreshResult.refreshToken).toBeDefined();
      expect(refreshResult.accessToken).not.toBe(registerResult.accessToken);
    });

    it("should reject refresh if the user no longer exists with 401 AUTHENTICATION_REQUIRED", async () => {
      const registerResult = await authService.register({
        email: "deleted@example.com",
        name: "Deleted User",
        password: "password123",
      });

      userRepository.users = [];

      await expect(
        authService.refresh(registerResult.refreshToken),
      ).rejects.toThrowError(
        new AppError(401, "AUTHENTICATION_REQUIRED", "User no longer exists"),
      );
    });
  });

  describe("getCurrentUser", () => {
    it("should return public user details for an existing user id", async () => {
      const registerResult = await authService.register({
        email: "me@example.com",
        name: "Me",
        password: "password123",
      });

      const user = await authService.getCurrentUser(registerResult.user.id);
      expect(user.email).toBe("me@example.com");
      expect("passwordHash" in user).toBe(false);
    });

    it("should reject with 401 AUTHENTICATION_REQUIRED if the user does not exist", async () => {
      await expect(
        authService.getCurrentUser("non-existent-id"),
      ).rejects.toThrowError(
        new AppError(401, "AUTHENTICATION_REQUIRED", "User no longer exists"),
      );
    });
  });
});
