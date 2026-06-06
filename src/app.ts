import express, { Express } from "express";
import { prisma } from "./config/prisma.js";
import { env } from "./config/env.js";
import { PrismaUserRepository } from "./modules/users/user.repository.js";
import { TokenService } from "./modules/auth/token.service.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { AuthController } from "./modules/auth/auth.controller.js";
import { authenticate } from "./middleware/authenticate.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { notFoundHandler } from "./shared/http/not-found.js";
import { errorHandler } from "./shared/errors/error-handler.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const userRepository = new PrismaUserRepository(prisma);
  const tokenService = new TokenService(
    env.jwtAccessSecret,
    env.jwtRefreshSecret,
    env.jwtAccessExpiresIn,
    env.jwtRefreshExpiresIn,
  );
  const authService = new AuthService(
    userRepository,
    tokenService,
    env.bcryptSaltRounds,
  );
  const authController = new AuthController(authService);
  const authenticateMiddleware = authenticate(tokenService);

  const authRouter = createAuthRouter(authController, authenticateMiddleware);

  app.use("/api/v1/auth", authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
