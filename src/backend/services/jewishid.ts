/**
 * JewishID service for managing identity verification and user profiles
 */

import { randomUUID } from 'crypto';
import { JewishID, VerificationLevel, Endorsement, EncryptedDocument } from '../models/JewishID';
import { AuthService } from './auth';
import { DatabaseService } from './database';
import { EncryptionService } from './encryption';
import { IPFSService } from './ipfs';
import { VerificationService } from './verification';

export interface JewishIDService {
  /**
   * Create a new JewishID profile with basic verification
   */
  createProfile(
    email: string,
    phone: string,
    mfaEnabled: boolean,
    initialDocuments?: Array<{
      data: Uint8Array;
      type: string;
      metadata: Record<string, unknown>;
    }>
  ): Promise<JewishID>;

  /**
   * Upgrade verification level with additional documents
   */
  upgradeVerification(
    id: string,
    documents: Array<{
      data: Uint8Array;
      type: string;
      metadata: Record<string, unknown>;
    }>,
    verificationMethod: JewishID['verificationMeta']['verificationMethod']
  ): Promise<JewishID>;

  /**
   * Get JewishID profile with decrypted personal info
   */
  getProfile(
    id: string,
    includePersonalInfo?: boolean
  ): Promise<{
    profile: JewishID;
    personalInfo?: Record<string, unknown>;
  }>;

  /**
   * Update profile MFA settings
   */
  updateMFASettings(
    id: string,
    enable: boolean
  ): Promise<void>;

  /**
   * Add endorsement to profile
   */
  addEndorsement(
    id: string,
    endorsement: Endorsement
  ): Promise<void>;

  /**
   * Get verification status and requirements
   */
  getVerificationStatus(
    id: string
  ): Promise<{
    currentLevel: typeof VerificationLevel[keyof typeof VerificationLevel];
    missingRequirements: Array<{
      type: string;
      description: string;
    }>;
    nextLevel?: typeof VerificationLevel[keyof typeof VerificationLevel];
  }>;
}

export class DefaultJewishIDService implements JewishIDService {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly encryptionService: EncryptionService,
    private readonly ipfsService: IPFSService,
    private readonly verificationService: VerificationService
  ) {}

  async createProfile(
    email: string,
    phone: string,
    mfaEnabled: boolean,
    initialDocuments?: Array<{
      data: Uint8Array;
      type: string;
      metadata: Record<string, unknown>;
    }>
  ): Promise<JewishID> {
    // Generate key pair for personal info encryption
    const { publicKey } = await this.encryptionService.generateKeyPair();

    // Set up MFA if enabled
    if (mfaEnabled) {
      const result = await this.authService.setupTOTP(email);
      const _secret = result.secret;
      const _qrCode = result.qrCode;
      await this.authService.generateBackupCodes(email);
    }

    // Encrypt and store personal info
    const personalInfo = {
      email,
      phone,
      mfaEnabled,
      createdAt: new Date()
    };
    const encryptedData = await this.encryptionService.encrypt(personalInfo, publicKey);

    // Store documents if provided
    const documents: EncryptedDocument[] = [];
    if (initialDocuments) {
      for (const doc of initialDocuments) {
        const { ipfsHash, encryptedKeys } = await this.ipfsService.storeDocument(
          doc.data,
          [publicKey],
          this.encryptionService
        );
        documents.push({
          id: randomUUID(),
          ipfsHash,
          encryptedKey: encryptedKeys[publicKey],
          documentType: doc.type,
          metadata: {
            ...doc.metadata,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    }

    // Create JewishID profile
    const profile: JewishID = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationLevel: VerificationLevel.BASIC,
      endorsements: [],
      documents,
      status: 'pending',
      personalInfo: {
        encryptedData,
        publicKey
      },
      verificationMeta: {
        lastVerified: new Date(),
        verificationMethod: 'heritage',
        verifierIds: []
      }
    };

    // Store in database
    await this.databaseService.createProfile(profile);

    return profile;
  }

  async upgradeVerification(
    id: string,
    documents: Array<{
      data: Uint8Array;
      type: string;
      metadata: Record<string, unknown>;
    }>,
    verificationMethod: JewishID['verificationMeta']['verificationMethod']
  ): Promise<JewishID> {
    // Get existing profile
    const profile = await this.databaseService.getProfile(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Store new documents
    const newDocuments: EncryptedDocument[] = [];
    for (const doc of documents) {
      const { ipfsHash, encryptedKeys } = await this.ipfsService.storeDocument(
        doc.data,
        [profile.personalInfo.publicKey],
        this.encryptionService
      );
      newDocuments.push({
        id: randomUUID(),
        ipfsHash,
        encryptedKey: encryptedKeys[profile.personalInfo.publicKey],
        documentType: doc.type,
        metadata: {
          ...doc.metadata,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    // Update profile with new documents and verification method
    const updatedProfile: JewishID = {
      ...profile,
      documents: [...profile.documents, ...newDocuments],
      verificationLevel: VerificationLevel.ADVANCED,
      updatedAt: new Date(),
      verificationMeta: {
        lastVerified: new Date(),
        verificationMethod,
        verifierIds: profile.verificationMeta.verifierIds
      }
    };

    // Store updated profile
    await this.databaseService.updateProfile(id, updatedProfile);

    return updatedProfile;
  }

  async getProfile(
    id: string,
    includePersonalInfo?: boolean
  ): Promise<{
    profile: JewishID;
    personalInfo?: Record<string, unknown>;
  }> {
    const profile = await this.databaseService.getProfile(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    let decryptedInfo: Record<string, unknown> | undefined;
    if (includePersonalInfo) {
      const decrypted = await this.encryptionService.decrypt(
        profile.personalInfo.encryptedData,
        profile.personalInfo.publicKey
      );
      decryptedInfo = decrypted as Record<string, unknown>;
    }

    return {
      profile,
      personalInfo: decryptedInfo
    };
  }

  async updateMFASettings(
    id: string,
    enable: boolean
  ): Promise<void> {
    const profile = await this.databaseService.getProfile(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Get decrypted personal info
    const decrypted = await this.encryptionService.decrypt(
      profile.personalInfo.encryptedData,
      profile.personalInfo.publicKey
    ) as Record<string, unknown>;

    // Update MFA settings
    if (enable && !decrypted.mfaEnabled) {
      const { email } = decrypted;
      const result = await this.authService.setupTOTP(email as string);
      const _secret = result.secret;
      const _qrCode = result.qrCode;
      await this.authService.generateBackupCodes(email as string);
    }

    // Update and re-encrypt personal info
    const updatedInfo = {
      ...decrypted,
      mfaEnabled: enable
    };
    const encryptedData = await this.encryptionService.encrypt(
      updatedInfo,
      profile.personalInfo.publicKey
    );

    // Update profile
    await this.databaseService.updateProfile(id, {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        encryptedData
      },
      updatedAt: new Date()
    });
  }

  async addEndorsement(
    id: string,
    endorsement: Endorsement
  ): Promise<void> {
    const profile = await this.databaseService.getProfile(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Verify endorsement signature
    const isValid = await this.verificationService.verifyEndorsement(endorsement);
    if (!isValid) {
      throw new Error('Invalid endorsement signature');
    }

    // Add endorsement and update trust level
    const updatedProfile: JewishID = {
      ...profile,
      endorsements: [...profile.endorsements, endorsement],
      updatedAt: new Date(),
      verificationMeta: {
        ...profile.verificationMeta,
        verifierIds: [...profile.verificationMeta.verifierIds, endorsement.issuerId]
      }
    };

    await this.databaseService.updateProfile(id, updatedProfile);
  }

  async getVerificationStatus(
    id: string
  ): Promise<{
    currentLevel: typeof VerificationLevel[keyof typeof VerificationLevel];
    missingRequirements: Array<{
      type: string;
      description: string;
    }>;
    nextLevel?: typeof VerificationLevel[keyof typeof VerificationLevel];
  }> {
    const profile = await this.databaseService.getProfile(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const _trustLevel = await this.verificationService.calculateTrustLevel(profile.endorsements);
    const currentLevel = profile.verificationLevel;

    // Define requirements for each level
    const requirements = {
      [VerificationLevel.BASIC]: [
        { type: 'identity', description: 'Government-issued ID' },
        { type: 'contact', description: 'Verified email and phone' }
      ],
      [VerificationLevel.ADVANCED]: [
        { type: 'heritage', description: 'Proof of Jewish heritage or conversion' },
        { type: 'community', description: 'Active community membership' },
        { type: 'endorsement', description: 'Minimum two endorsements' }
      ]
    };

    // Determine missing requirements
    const missingRequirements = requirements[currentLevel].filter(req => {
      if (req.type === 'endorsement') {
        return profile.endorsements.length < 2;
      }
      return !profile.documents.some(doc => doc.documentType === req.type);
    });

    return {
      currentLevel,
      missingRequirements,
      nextLevel: currentLevel === VerificationLevel.BASIC ? VerificationLevel.ADVANCED : undefined
    };
  }
}
