/**
 * User profile model for managing personal information
 */

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contact: {
    email: string;
    phone: string;
    preferredMethod: 'email' | 'phone';
  };
  heritageInfo?: {
    maternalLineage?: string[];
    paternalLineage?: string[];
    conversionDate?: Date;
    conversionAuthority?: string;
  };
}

export interface ProfileSettings {
  mfaEnabled: boolean;
  mfaMethod: 'totp' | 'backup' | null;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacySettings: {
    shareEndorsements: boolean;
    shareVerificationLevel: boolean;
    publicProfile: boolean;
  };
}

export interface UserProfile {
  id: string;
  jewishId: string;
  personalInfo: {
    encryptedData: string;
    publicKey: string;
  };
  settings: ProfileSettings;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  status: 'active' | 'inactive' | 'suspended';
}
