import { Router, RequestHandler } from "express";
import { AuthController } from "./auth.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schemas.js";
import { asyncHandler } from "../../shared/http/async-handler.js";

export function createAuthRouter(
  controller: AuthController,
  authenticateMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.post(
    "/register",
    validateBody(registerSchema),
    asyncHandler(controller.register),
  );

  router.post(
    "/login",
    validateBody(loginSchema),
    asyncHandler(controller.login),
  );

  router.post(
    "/refresh",
    validateBody(refreshSchema),
    asyncHandler(controller.refresh),
  );

  router.get("/me", authenticateMiddleware, asyncHandler(controller.me));

  return router;
}
