/**
 * JWT authentication service
 */

export interface JWTPayload {
  userId: string;
  roles: string[];
  mfaVerified: boolean;
  kycLevel: 'none' | 'basic' | 'advanced';
  exp: number;
  iat: number;
}

export interface JWTConfig {
  algorithm: 'HS256' | 'RS256';
  expiresIn: string | number;
  issuer: string;
  audience: string[];
}

export interface JWTService {
  /**
   * Generate access token
   */
  generateToken(
    userId: string,
    roles: string[],
    mfaVerified: boolean,
    kycLevel: JWTPayload['kycLevel']
  ): Promise<{
    token: string;
    expiresAt: Date;
  }>;

  /**
   * Verify and decode token
   */
  verifyToken(token: string): Promise<JWTPayload>;

  /**
   * Revoke token
   */
  revokeToken(token: string): Promise<void>;

  /**
   * Check if token is blacklisted
   */
  isTokenBlacklisted(token: string): Promise<boolean>;
}

// Placeholder implementation
export class DefaultJWTService implements JWTService {
  async generateToken(
    userId: string,
    roles: string[],
    mfaVerified: boolean,
    kycLevel: JWTPayload['kycLevel']
  ): Promise<{
    token: string;
    expiresAt: Date;
  }> {
    throw new Error('Not implemented');
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    throw new Error('Not implemented');
  }

  async revokeToken(token: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    throw new Error('Not implemented');
  }
}
