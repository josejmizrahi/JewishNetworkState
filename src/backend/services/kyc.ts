/**
 * KYC/AML compliance service
 */

export interface KYCDocument {
  id: string;
  userId: string;
  type: 'id' | 'proof_of_address' | 'religious_certification';
  status: 'pending' | 'verified' | 'rejected';
  ipfsHash: string;
  metadata: {
    documentType: string;
    issuingAuthority: string;
    expiryDate?: Date;
    verificationMethod: 'automated' | 'manual';
  };
  verificationDetails?: {
    verifiedBy: string;
    verifiedAt: Date;
    notes?: string;
  };
}

export interface AMLCheck {
  userId: string;
  type: 'transaction_monitoring' | 'risk_assessment';
  status: 'passed' | 'flagged' | 'blocked';
  riskScore: number;
  checkDate: Date;
  details: {
    factors: Array<{
      name: string;
      score: number;
      threshold: number;
    }>;
    alerts?: Array<{
      level: 'info' | 'warning' | 'critical';
      message: string;
      timestamp: Date;
    }>;
  };
}

export interface KYCService {
  /**
   * Submit KYC documents for verification
   */
  submitDocuments(
    userId: string,
    documents: Array<{
      type: KYCDocument['type'];
      ipfsHash: string;
      metadata: KYCDocument['metadata'];
    }>
  ): Promise<KYCDocument[]>;

  /**
   * Get KYC status for a user
   */
  getKYCStatus(userId: string): Promise<{
    status: 'none' | 'pending' | 'partial' | 'complete';
    documents: KYCDocument[];
    missingDocuments: KYCDocument['type'][];
  }>;

  /**
   * Perform AML check
   */
  performAMLCheck(
    userId: string,
    type: AMLCheck['type'],
    data: Record<string, unknown>
  ): Promise<AMLCheck>;

  /**
   * Get transaction limits based on KYC level
   */
  getTransactionLimits(userId: string): Promise<{
    daily: number;
    monthly: number;
    yearly: number;
    perTransaction: number;
  }>;
}

// Placeholder implementation
export class DefaultKYCService implements KYCService {
  async submitDocuments(
    userId: string,
    documents: Array<{
      type: KYCDocument['type'];
      ipfsHash: string;
      metadata: KYCDocument['metadata'];
    }>
  ): Promise<KYCDocument[]> {
    throw new Error('Not implemented');
  }

  async getKYCStatus(userId: string): Promise<{
    status: 'none' | 'pending' | 'partial' | 'complete';
    documents: KYCDocument[];
    missingDocuments: KYCDocument['type'][];
  }> {
    throw new Error('Not implemented');
  }

  async performAMLCheck(
    userId: string,
    type: AMLCheck['type'],
    data: Record<string, unknown>
  ): Promise<AMLCheck> {
    throw new Error('Not implemented');
  }

  async getTransactionLimits(userId: string): Promise<{
    daily: number;
    monthly: number;
    yearly: number;
    perTransaction: number;
  }> {
    throw new Error('Not implemented');
  }
}
