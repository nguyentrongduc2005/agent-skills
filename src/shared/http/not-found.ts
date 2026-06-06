import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  next(new AppError(404, "NOT_FOUND", "Resource not found"));
}
