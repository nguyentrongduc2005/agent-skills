import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { RegisterInput, LoginInput, RefreshInput } from "./auth.schemas.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body as RegisterInput);
    res.status(201).json({
      data: result,
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body as LoginInput);
    res.status(200).json({
      data: result,
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.refresh(
      (req.body as RefreshInput).refreshToken,
    );
    res.status(200).json({
      data: result,
    });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth?.userId;
    if (!userId) {
      res.status(401).json({
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication is required",
        },
      });
      return;
    }

    const user = await this.authService.getCurrentUser(userId);
    res.status(200).json({
      data: { user },
    });
  };
}
