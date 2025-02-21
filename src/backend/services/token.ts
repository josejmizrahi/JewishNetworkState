/**
 * Token service for managing ShekelCoin and MitzvahPoints
 */

import { randomUUID } from 'node:crypto';
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
    // Set up trust line and issue tokens
    await this.xrplService.setupTrustLine(
      toAddress,
      'SHK',
      amount.toString(10)
    );

    await this.xrplService.issueTokens(
      toAddress,
      'SHK',
      amount.toString(10)
    );

    // Record issuance
    const shekelCoin: ShekelCoin = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: toAddress,
      type: 'SHK',
      amount,
      frozen: false,
      trustLineIssuer: (await this.xrplService.initializeIssuer()).issuerAddress,
      metadata: metadata || {}
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
    // Set up trust line and issue soulbound tokens
    await this.xrplService.setupTrustLine(
      toAddress,
      'MVP',
      points.toString()
    );

    await this.xrplService.issueTokens(
      toAddress,
      'MVP',
      points.toString()
    );

    // Record achievement
    const mitzvahPoints: MitzvahPoints = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: toAddress,
      type: 'MVP',
      points,
      category,
      soulbound: true,
      achievements: [{
        id: randomUUID(),
        ...achievement,
        earnedAt: new Date()
      }],
      metadata: {}
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
    const balances = await this.xrplService.getBalances(fromAddress);
    const balance = balances.find(b => b.currency === 'SHK');
    if (!balance || BigInt(balance.value) < amount) {
      throw new Error('Insufficient balance');
    }

    // Transfer tokens
    await this.xrplService.transferTokens(
      fromAddress,
      toAddress,
      'SHK',
      amount.toString(10)
    );

    // Record transfer
    const transaction: TokenTransaction = {
      id: randomUUID(),
      fromAddress,
      toAddress,
      currency: 'SHK',
      amount: amount.toString(10),
      timestamp: new Date(),
      status: 'pending',
      type: 'transfer',
      tokenType: 'SHK'
    };

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
    const balances = await this.xrplService.getBalances(address);
    const balance = balances.find(b => b.currency === tokenType);

    return {
      available: balance?.frozen ? '0' : balance?.value || '0',
      frozen: balance?.frozen ? balance.value : undefined
    };
  }
}
