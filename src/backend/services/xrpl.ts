/**
 * XRPL service for managing blockchain interactions
 */

import { Client, Wallet } from 'xrpl';
// These types are used in JSDoc comments
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TrustSet, Payment } from 'xrpl/dist/npm/models/transactions';
/* eslint-enable @typescript-eslint/no-unused-vars */
import { DatabaseService } from './database';
import { KeyStoreService } from './keystore';

export interface XRPLConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  issuerSeed: string;
  shekelCoinCurrency: string;
  mitzvahPointsCurrency: string;
}

export interface XRPLService {
  /**
   * Initialize XRPL client and issuer wallet
   */
  initialize(config: XRPLConfig): Promise<void>;

  /**
   * Initialize issuer account and currencies
   */
  initializeIssuer(): Promise<{
    issuerAddress: string;
    shekelCoinCurrency: string;
    mitzvahPointsCurrency: string;
  }>;

  /**
   * Set up trust line for user
   */
  setupTrustLine(
    userAddress: string,
    currency: 'SHK' | 'MVP',
    limit: string
  ): Promise<string>;

  /**
   * Issue tokens to user
   */
  issueTokens(
    toAddress: string,
    currency: 'SHK' | 'MVP',
    amount: string
  ): Promise<string>;

  /**
   * Transfer tokens between users
   */
  transferTokens(
    fromAddress: string,
    toAddress: string,
    currency: 'SHK' | 'MVP',
    amount: string
  ): Promise<string>;

  /**
   * Get account balances
   */
  getBalances(
    address: string
  ): Promise<Array<{
    currency: string;
    value: string;
    issuer: string;
    frozen?: boolean;
  }>>;

}

export class DefaultXRPLService implements XRPLService {
  private client: Client;
  public readonly issuerWallet: Wallet;

  constructor(
    private readonly config: XRPLConfig,
    private readonly databaseService: DatabaseService,
    private readonly keyStoreService: KeyStoreService
  ) {
    this.client = new Client(this.getNetworkURL(config.network));
    this.issuerWallet = Wallet.fromSeed(config.issuerSeed);
  }

  async initialize(config: XRPLConfig): Promise<void> {
    // Update client with new config
    this.client = new Client(this.getNetworkURL(config.network));
  }

  private getNetworkURL(network: XRPLConfig['network']): string {
    switch (network) {
      case 'mainnet':
        return 'wss://xrplcluster.com';
      case 'testnet':
        return 'wss://s.altnet.rippletest.net:51233';
      case 'devnet':
        return 'wss://s.devnet.rippletest.net:51233';
      default:
        throw new Error('Invalid network');
    }
  }

  async initializeIssuer(): Promise<{
    issuerAddress: string;
    shekelCoinCurrency: string;
    mitzvahPointsCurrency: string;
  }> {
    await this.client.connect();

    try {
      // Set default rippling
      await this.client.submitAndWait({
        TransactionType: 'AccountSet',
        Account: this.issuerWallet.address,
        SetFlag: 8 // Default Rippling
      });

      return {
        issuerAddress: this.issuerWallet.address,
        shekelCoinCurrency: this.config.shekelCoinCurrency,
        mitzvahPointsCurrency: this.config.mitzvahPointsCurrency
      };
    } finally {
      await this.client.disconnect();
    }
  }

  async setupTrustLine(
    userAddress: string,
    currency: 'SHK' | 'MVP',
    limit: string
  ): Promise<string> {
    await this.client.connect();

    try {
      const currencyCode = currency === 'SHK' 
        ? this.config.shekelCoinCurrency 
        : this.config.mitzvahPointsCurrency;

      const tx = await this.client.submitAndWait({
        TransactionType: 'TrustSet',
        Account: userAddress,
        LimitAmount: {
          currency: currencyCode,
          issuer: this.issuerWallet.address,
          value: limit
        }
      });

      return tx.result.hash;
    } finally {
      await this.client.disconnect();
    }
  }

  async issueTokens(
    toAddress: string,
    currency: 'SHK' | 'MVP',
    amount: string
  ): Promise<string> {
    await this.client.connect();

    try {
      const currencyCode = currency === 'SHK'
        ? this.config.shekelCoinCurrency
        : this.config.mitzvahPointsCurrency;

      const tx = await this.client.submitAndWait({
        TransactionType: 'Payment',
        Account: this.issuerWallet.address,
        Destination: toAddress,
        Amount: {
          currency: currencyCode,
          issuer: this.issuerWallet.address,
          value: amount
        }
      });

      return tx.result.hash;
    } finally {
      await this.client.disconnect();
    }
  }

  async transferTokens(
    fromAddress: string,
    toAddress: string,
    currency: 'SHK' | 'MVP',
    amount: string
  ): Promise<string> {
    await this.client.connect();

    try {
      const currencyCode = currency === 'SHK'
        ? this.config.shekelCoinCurrency
        : this.config.mitzvahPointsCurrency;

      const tx = await this.client.submitAndWait({
        TransactionType: 'Payment',
        Account: fromAddress,
        Destination: toAddress,
        Amount: {
          currency: currencyCode,
          issuer: this.issuerWallet.address,
          value: amount
        }
      });

      return tx.result.hash;
    } finally {
      await this.client.disconnect();
    }
  }

  async getBalances(
    address: string
  ): Promise<Array<{
    currency: string;
    value: string;
    issuer: string;
    frozen?: boolean;
  }>> {
    await this.client.connect();

    try {
      const response = await this.client.request({
        command: 'account_lines',
        account: address,
        ledger_index: 'validated'
      });

      return response.result.lines.map(line => ({
        currency: line.currency,
        value: line.balance,
        issuer: line.account,
        frozen: line.freeze || false
      }));
    } finally {
      await this.client.disconnect();
    }
  }
}
