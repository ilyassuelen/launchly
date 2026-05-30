export type CoverLetterTemplate =
  | "classic"
  | "modern"
  | "minimal"
  | "startup";

export interface CoverLetterTypography {
  fontFamily: string;

  fontSize: number;

  lineHeight: number;
}

export interface CoverLetterSender {
  fullName: string;

  currentRole?: string;

  skills?: string[];

  street: string;

  zip: string;

  city: string;

  email: string;

  phone: string;
}

export interface CoverLetterRecipient {
  companyName: string;

  contactName: string;

  street: string;

  zip: string;

  city: string;
}

export interface CoverLetterContent {
  subject: string;

  body: string;

  closing: string;
}

export interface CoverLetter {
  id?: number | string;

  title: string;

  selectedResumeId?: string | number;

  resumeContext?: string;

  structuredResumeData?: Record<string, any> | null;

  language?: "english" | "german";

  jobPosting: string;

  tone: string;

  template: CoverLetterTemplate;

  typography?: CoverLetterTypography;

  sender: CoverLetterSender;

  recipient: CoverLetterRecipient;

  date: string;

  createdAt?: string;

  updatedAt?: string;

  created_at?: string;

  updated_at?: string;

  latest_cover_letter_analysis?: Record<string, any> | null;

  latest_cover_letter_analysis_created_at?: string | null;

  content: CoverLetterContent;
}