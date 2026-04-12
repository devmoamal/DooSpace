export interface JWTMiniAppPayload {
  id: number;
  username: string;
}

export interface JWTAdminAccessPayload {
  id: number;
  role: string;
}

export interface RefreshPayload {
  id: number;
  version: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
