import { describe, it, expect } from "vitest";
import { TokenService } from "../../src/modules/auth/token.service.js";
import { AppError } from "../../src/shared/errors/app-error.js";
import jwt from "jsonwebtoken";

describe("TokenService", () => {
  const tokenService = new TokenService(
    "access-secret-key-1234567890-must-be-long",
    "refresh-secret-key-1234567890-must-be-long",
    "15m",
    "7d",
  );

  it("should issue access and refresh tokens with correct sub and type claims", () => {
    const userId = "user-uuid-123";
    const pair = tokenService.issuePair(userId);

    expect(pair.accessToken).toBeDefined();
    expect(pair.refreshToken).toBeDefined();

    const accessDecoded = jwt.decode(pair.accessToken) as jwt.JwtPayload;
    const refreshDecoded = jwt.decode(pair.refreshToken) as jwt.JwtPayload;

    expect(accessDecoded.sub).toBe(userId);
    expect(accessDecoded.type).toBe("access");
    expect(refreshDecoded.sub).toBe(userId);
    expect(refreshDecoded.type).toBe("refresh");
  });

  it("should verify a valid access token and extract the userId", () => {
    const userId = "user-uuid-123";
    const pair = tokenService.issuePair(userId);

    const payload = tokenService.verifyAccess(pair.accessToken);
    expect(payload.userId).toBe(userId);
  });

  it("should verify a valid refresh token and extract the userId", () => {
    const userId = "user-uuid-123";
    const pair = tokenService.issuePair(userId);

    const payload = tokenService.verifyRefresh(pair.refreshToken);
    expect(payload.userId).toBe(userId);
  });

  it("should reject access token verification with refresh secret", () => {
    const userId = "user-uuid-123";
    const pair = tokenService.issuePair(userId);

    expect(() => tokenService.verifyRefresh(pair.accessToken)).toThrowError(
      AppError,
    );
    try {
      tokenService.verifyRefresh(pair.accessToken);
    } catch (err) {
      const appErr = err as AppError;
      expect(appErr.status).toBe(401);
      expect(appErr.code).toBe("AUTHENTICATION_REQUIRED");
    }
  });

  it("should reject refresh token verification with access secret", () => {
    const userId = "user-uuid-123";
    const pair = tokenService.issuePair(userId);

    expect(() => tokenService.verifyAccess(pair.refreshToken)).toThrowError(
      AppError,
    );
    try {
      tokenService.verifyAccess(pair.refreshToken);
    } catch (err) {
      const appErr = err as AppError;
      expect(appErr.status).toBe(401);
      expect(appErr.code).toBe("AUTHENTICATION_REQUIRED");
    }
  });

  it("should reject expired, malformed, or wrong-secret tokens with 401 AUTHENTICATION_REQUIRED", () => {
    expect(() => tokenService.verifyAccess("malformed-token")).toThrowError(
      AppError,
    );

    const otherService = new TokenService(
      "wrong-secret-access",
      "wrong-secret-refresh",
      "15m",
      "7d",
    );
    const wrongPair = otherService.issuePair("user-123");
    expect(() => tokenService.verifyAccess(wrongPair.accessToken)).toThrowError(
      AppError,
    );

    const expiredService = new TokenService(
      "access-secret-key-1234567890-must-be-long",
      "refresh-secret-key-1234567890-must-be-long",
      "0s",
      "0s",
    );
    const expiredPair = expiredService.issuePair("user-123");
    expect(() =>
      tokenService.verifyAccess(expiredPair.accessToken),
    ).toThrowError(AppError);
  });
});
