import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "../../shared/errors/app-error.js";

interface TokenPayload extends jwt.JwtPayload {
  sub: string;
  type: "access" | "refresh";
}

export class TokenService {
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string,
    private readonly accessExpiresIn: string,
    private readonly refreshExpiresIn: string,
  ) {}

  issuePair(userId: string): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ type: "access" }, this.accessSecret, {
      algorithm: "HS256",
      subject: userId,
      expiresIn: this.accessExpiresIn as SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ type: "refresh" }, this.refreshSecret, {
      algorithm: "HS256",
      subject: userId,
      expiresIn: this.refreshExpiresIn as SignOptions["expiresIn"],
    });

    return { accessToken, refreshToken };
  }

  verifyAccess(token: string): { userId: string } {
    return this.verifyToken(token, this.accessSecret, "access");
  }

  verifyRefresh(token: string): { userId: string } {
    return this.verifyToken(token, this.refreshSecret, "refresh");
  }

  private verifyToken(
    token: string,
    secret: string,
    expectedType: "access" | "refresh",
  ): { userId: string } {
    try {
      const decoded = jwt.verify(token, secret, {
        algorithms: ["HS256"],
      }) as TokenPayload;

      if (!decoded.sub || decoded.type !== expectedType) {
        throw new Error("Invalid token claims");
      }

      return { userId: decoded.sub };
    } catch {
      throw new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authentication is required to access this resource",
      );
    }
  }
}
