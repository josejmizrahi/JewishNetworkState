/**
 * Token service for managing ShekelCoin and MitzvahPoints
 */

import { TokenTransaction, ShekelCoin, MitzvahPoints } from '../models/Token';

export interface TokenService {
  /**
   * Issue new ShekelCoins to an address
   */
  issueShekelCoins(
    toAddress: string,
    amount: bigint,
    metadata?: Record<string, unknown>
  ): Promise<ShekelCoin>;

  /**
   * Award MitzvahPoints for community contributions
   */
  awardMitzvahPoints(
    toAddress: string,
    points: number,
    category: MitzvahPoints['category'],
    achievement: {
      name: string;
      description: string;
    }
  ): Promise<MitzvahPoints>;

  /**
   * Transfer ShekelCoins between addresses
   */
  transferShekelCoins(
    fromAddress: string,
    toAddress: string,
    amount: bigint
  ): Promise<TokenTransaction>;

  /**
   * Get token balance for an address
   */
  getBalance(
    address: string,
    tokenType: 'SHK' | 'MVP'
  ): Promise<{
    available: string;
    frozen?: string;
  }>;
}

// Placeholder implementation
export class DefaultTokenService implements TokenService {
  async issueShekelCoins(
    toAddress: string,
    amount: bigint,
    metadata?: Record<string, unknown>
  ): Promise<ShekelCoin> {
    throw new Error('Not implemented');
  }

  async awardMitzvahPoints(
    toAddress: string,
    points: number,
    category: MitzvahPoints['category'],
    achievement: {
      name: string;
      description: string;
    }
  ): Promise<MitzvahPoints> {
    throw new Error('Not implemented');
  }

  async transferShekelCoins(
    fromAddress: string,
    toAddress: string,
    amount: bigint
  ): Promise<TokenTransaction> {
    throw new Error('Not implemented');
  }

  async getBalance(
    address: string,
    tokenType: 'SHK' | 'MVP'
  ): Promise<{
    available: string;
    frozen?: string;
  }> {
    throw new Error('Not implemented');
  }
}
