/**
 * Core JewishID model implementing the identity requirements
 * from the Jewish Network State specification
 */

export enum VerificationLevel {
  BASIC = 'basic',
  ADVANCED = 'advanced'
}

export enum EndorsementType {
  RABBI = 'rabbi',
  SYNAGOGUE = 'synagogue',
  FEDERATION = 'federation'
}

export interface Endorsement {
  issuerId: string;
  type: EndorsementType;
  level: number;
  timestamp: Date;
  signature: string;
}

export interface EncryptedDocument {
  id: string;
  ipfsHash: string;
  encryptedKey: string;
  documentType: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    verifiedBy?: string[];
  };
}

export interface JewishID {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  verificationLevel: VerificationLevel;
  endorsements: Endorsement[];
  documents: EncryptedDocument[];
  status: 'active' | 'pending' | 'suspended';
  
  // Personal Information (encrypted)
  personalInfo: {
    encryptedData: string;
    publicKey: string;
  };
  
  // Verification Metadata
  verificationMeta: {
    lastVerified: Date;
    verificationMethod: 'heritage' | 'conversion' | 'community';
    verifierIds: string[];
  };
}
