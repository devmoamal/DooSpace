import { userRepository } from "@/repositories/user.repository";
import { UnauthorizedError } from "@/lib/error";
import { JWT } from "@/lib/jwt";
import { verifyPassword } from "@/utils/password";

export class AuthService {
  async login(username: string, pass: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const isMatch = await verifyPassword(pass, user.password);
    if (!isMatch) throw new UnauthorizedError("Invalid credentials");

    const tokens = JWT.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async refresh(refreshToken: string) {
    const payload = JWT.verifyRefreshToken(refreshToken);
    if (!payload) throw new UnauthorizedError("Invalid refresh token");

    const user = await userRepository.findById(payload.id);
    if (!user) throw new UnauthorizedError("User not found");

    // Check version for token revocation
    if (payload.version !== user.version) {
      throw new UnauthorizedError("Token has been revoked");
    }

    const tokens = JWT.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  verifyAccessToken(token: string) {
    return JWT.verifyAccessToken(token);
  }
}

export const authService = new AuthService();
