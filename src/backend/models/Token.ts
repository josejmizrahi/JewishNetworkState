/**
 * Token models for ShekelCoin (SHK) and MitzvahPoints (MVP)
 */

export interface TokenBase {
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
  timestamp: Date;
  fromAddress: string;
  toAddress: string;
  tokenType: 'SHK' | 'MVP';
  amount: string; // Decimal string for precise amounts
  status: 'pending' | 'completed' | 'failed';
  metadata: {
    reason?: string;
    reference?: string;
    xrplTxHash?: string;
  };
}
