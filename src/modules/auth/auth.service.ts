import bcrypt from "bcrypt";
import {
  DuplicateEmailError,
  PublicUser,
  UserRepository,
} from "../users/user.types.js";
import { TokenService } from "./token.service.js";
import { LoginInput, RegisterInput } from "./auth.schemas.js";
import { toPublicUser } from "../users/user.mapper.js";
import { AppError } from "../../shared/errors/app-error.js";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends TokenPair {
  user: PublicUser;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly bcryptSaltRounds: number,
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    try {
      const passwordHash = await bcrypt.hash(
        input.password,
        this.bcryptSaltRounds,
      );
      const user = await this.userRepository.create({
        email: input.email,
        name: input.name,
        passwordHash,
      });

      const tokens = this.tokenService.issuePair(user.id);
      return {
        user: toPublicUser(user),
        ...tokens,
      };
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        throw new AppError(
          409,
          "EMAIL_ALREADY_EXISTS",
          "Email address already registered",
        );
      }
      throw error;
    }
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password",
      );
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password",
      );
    }

    const tokens = this.tokenService.issuePair(user.id);
    return {
      user: toPublicUser(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const { userId } = this.tokenService.verifyRefresh(refreshToken);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "User no longer exists",
      );
    }

    return this.tokenService.issuePair(user.id);
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "User no longer exists",
      );
    }

    return toPublicUser(user);
  }
}
