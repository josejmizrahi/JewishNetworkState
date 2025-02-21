export type VerificationStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  requirements: Array<{
    type: string;
    description: string;
    completed: boolean;
  }>;
};

export type VerificationLevel = 'basic' | 'advanced';

export type DocumentType = 'identity' | 'heritage' | 'conversion' | 'community';

export const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Provide your personal information for initial verification',
    status: 'pending',
    requirements: [
      {
        type: 'personal',
        description: 'Full legal name and contact information',
        completed: false
      },
      {
        type: 'hebrew-name',
        description: 'Hebrew name if applicable',
        completed: false
      }
    ]
  },
  {
    id: 'document-upload',
    title: 'Document Upload',
    description: 'Upload required documentation for verification',
    status: 'pending',
    requirements: [
      {
        type: 'identity',
        description: 'Government-issued ID or passport',
        completed: false
      },
      {
        type: 'heritage',
        description: 'Proof of Jewish heritage or conversion documentation',
        completed: false
      }
    ]
  },
  {
    id: 'rabbi-reference',
    title: 'Rabbi Reference',
    description: 'Provide reference from a recognized Rabbi',
    status: 'pending',
    requirements: [
      {
        type: 'reference',
        description: "Rabbi's contact information",
        completed: false
      },
      {
        type: 'community',
        description: 'Synagogue or community affiliation',
        completed: false
      }
    ]
  }
];
