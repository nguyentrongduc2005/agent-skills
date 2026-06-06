import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../shared/errors/app-error.js";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        path: issue.path,
        code: issue.code,
        message: issue.message,
      }));
      next(
        new AppError(
          400,
          "VALIDATION_ERROR",
          "Request validation failed",
          details,
        ),
      );
      return;
    }
    req.body = parsed.data;
    next();
  };
}
