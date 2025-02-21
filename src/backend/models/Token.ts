/**
 * Token models for ShekelCoin (SHK) and MitzvahPoints (MVP)
 */

export interface ShekelCoin {
  id: string;
  address: string;
  amount: string;
  timestamp: Date;
  status: 'issued' | 'burned';
  metadata?: Record<string, unknown>;
}

export interface MitzvahPoints {
  id: string;
  points: number;
  category: 'community' | 'learning' | 'charity' | 'ritual';
  achievement: {
    name: string;
    description: string;
  };
  timestamp: Date;
  status: 'awarded' | 'revoked';
}

export interface TokenTransaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  currency: string;
  amount: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  type: 'transfer' | 'issuance' | 'burn';
  tokenType: 'SHK' | 'MVP';
  metadata?: {
    reason?: string;
    reference?: string;
    xrplTxHash?: string;
  };
}
  id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  metadata: Record<string, unknown>;
}

export interface ShekelCoin extends TokenBase {
  type: 'SHK';
  amount: bigint;
  frozen: boolean;
  trustLineIssuer: string;
}

export interface MitzvahPoints extends TokenBase {
  type: 'MVP';
  points: number;
  category: 'community' | 'religious' | 'charity';
  soulbound: true; // Always true as MitzvahPoints are non-transferable
  achievements: {
    id: string;
    name: string;
    description: string;
    earnedAt: Date;
  }[];
}

export interface TokenTransaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  currency: string;
  amount: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  type: 'transfer' | 'issuance' | 'burn';
  tokenType: 'SHK' | 'MVP';
  metadata?: {
    reason?: string;
    reference?: string;
    xrplTxHash?: string;
  };
}
