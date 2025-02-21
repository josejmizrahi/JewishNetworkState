/**
 * IPFS service for decentralized document storage
 */

import { EncryptionService } from './encryption';

export interface IPFSService {
  /**
   * Store an encrypted document on IPFS
   */
  storeDocument(
    document: Uint8Array,
    recipientPublicKeys: string[],
    encryptionService: EncryptionService
  ): Promise<{
    ipfsHash: string;
    encryptedKeys: Record<string, string>;
  }>;

  /**
   * Retrieve an encrypted document from IPFS
   */
  retrieveDocument(
    ipfsHash: string,
    privateKey: string,
    encryptionService: EncryptionService
  ): Promise<Uint8Array>;
}

// Placeholder implementation
export class DefaultIPFSService implements IPFSService {
  async storeDocument(
    document: Uint8Array,
    recipientPublicKeys: string[],
    encryptionService: EncryptionService
  ): Promise<{
    ipfsHash: string;
    encryptedKeys: Record<string, string>;
  }> {
    throw new Error('Not implemented');
  }

  async retrieveDocument(
    ipfsHash: string,
    privateKey: string,
    encryptionService: EncryptionService
  ): Promise<Uint8Array> {
    throw new Error('Not implemented');
  }
}
