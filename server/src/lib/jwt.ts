import jwt from "jsonwebtoken";
import { env } from "@/config/env.config";
import {
  type JWTMiniAppPayload,
  type RefreshPayload,
  type Tokens,
} from "./types/jwt";
import { type User } from "@/db/types";

export class JWT {
  static signAccessToken(user: User): string {
    return jwt.sign(
      { id: user.id, username: user.username } as JWTMiniAppPayload,
      env.JWT_SECRET,
      { expiresIn: "6h" },
    );
  }

  static signRefreshToken(user: User): string {
    return jwt.sign(
      { id: user.id, version: user.version } as RefreshPayload,
      env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );
  }

  static verifyAccessToken(token: string): JWTMiniAppPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JWTMiniAppPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): RefreshPayload | null {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
    } catch (error) {
      return null;
    }
  }

  static generateTokens(user: User): Tokens {
    return {
      accessToken: this.signAccessToken(user),
      refreshToken: this.signRefreshToken(user),
    };
  }
}
