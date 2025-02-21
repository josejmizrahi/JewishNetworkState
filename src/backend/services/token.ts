/**
 * Token service for managing ShekelCoin and MitzvahPoints
 */

import { randomUUID } from 'crypto';
import { TokenTransaction, ShekelCoin, MitzvahPoints } from '../models/Token';
import { XRPLService } from './xrpl';
import { DatabaseService } from './database';

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

export class DefaultTokenService implements TokenService {
  constructor(
    private readonly xrplService: XRPLService,
    private readonly databaseService: DatabaseService
  ) {}
  async issueShekelCoins(
    toAddress: string,
    amount: bigint,
    metadata?: Record<string, unknown>
  ): Promise<ShekelCoin> {
    // Set up trust line if not exists
    await this.xrplService.setupTrustLine(
      toAddress,
      'SHK',
      amount.toString()
    );

    // Issue tokens
    const payment = await this.xrplService.issueTokens(
      toAddress,
      'SHK',
      amount.toString(),
      metadata ? JSON.stringify(metadata) : undefined
    );

    // Record issuance
    const shekelCoin: ShekelCoin = {
      id: randomUUID(),
      address: toAddress,
      amount: amount.toString(),
      timestamp: new Date(),
      status: 'issued',
      metadata
    };

    await this.databaseService.recordTokenIssuance(shekelCoin);

    return shekelCoin;
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
    // Set up trust line for MVP tokens
    await this.xrplService.setupTrustLine(
      toAddress,
      'MVP',
      points.toString()
    );

    // Issue soulbound tokens
    const payment = await this.xrplService.issueTokens(
      toAddress,
      'MVP',
      points.toString(),
      JSON.stringify({
        category,
        achievement,
        soulbound: true
      })
    );

    // Record achievement
    const mitzvahPoints: MitzvahPoints = {
      id: randomUUID(),
      address: toAddress,
      points,
      category,
      achievement,
      timestamp: new Date(),
      status: 'awarded'
    };

    await this.databaseService.recordAchievement(mitzvahPoints);

    return mitzvahPoints;
  }

  async transferShekelCoins(
    fromAddress: string,
    toAddress: string,
    amount: bigint
  ): Promise<TokenTransaction> {
    // Verify sufficient balance
    const balance = await this.xrplService.getBalance(fromAddress, 'SHK');
    if (BigInt(balance.balance) < amount) {
      throw new Error('Insufficient balance');
    }

    // Transfer tokens
    const transaction = await this.xrplService.transferTokens(
      fromAddress,
      toAddress,
      'SHK',
      amount.toString()
    );

    // Record transfer
    await this.databaseService.recordTokenTransfer(transaction);

    return transaction;
  }

  async getBalance(
    address: string,
    tokenType: 'SHK' | 'MVP'
  ): Promise<{
    available: string;
    frozen?: string;
  }> {
    const balance = await this.xrplService.getBalance(
      address,
      tokenType
    );

    return {
      available: balance.frozen ? '0' : balance.balance,
      frozen: balance.frozen ? balance.balance : undefined
    };
  }
  }
}
