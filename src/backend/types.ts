/**
 * Core types for the Jewish Network State infrastructure
 */
export interface JewishIDBase {
  id: string;
  createdAt: Date;
  verificationLevel: 'basic' | 'advanced';
}
