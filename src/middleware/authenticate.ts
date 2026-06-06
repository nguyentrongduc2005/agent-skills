import { Request, Response, NextFunction } from "express";
import { TokenService } from "../modules/auth/token.service.js";
import { AppError } from "../shared/errors/app-error.js";

export function authenticate(tokenService: TokenService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(
        new AppError(
          401,
          "AUTHENTICATION_REQUIRED",
          "Authorization header is missing",
        ),
      );
      return;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      next(
        new AppError(
          401,
          "AUTHENTICATION_REQUIRED",
          "Authorization header must use Bearer schema",
        ),
      );
      return;
    }

    const token = parts[1];
    if (!token) {
      next(
        new AppError(
          401,
          "AUTHENTICATION_REQUIRED",
          "Authorization token is empty",
        ),
      );
      return;
    }

    const payload = tokenService.verifyAccess(token);
    req.auth = {
      userId: payload.userId,
    };
    next();
  };
}
