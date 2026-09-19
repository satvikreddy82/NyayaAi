export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type LanguageCode = 'en' | 'ta' | 'te' | 'hi';

export type CaseCategory =
  | 'rental'
  | 'employment'
  | 'consumer'
  | 'financial'
  | 'cybercrime'
  | 'property'
  | 'education'
  | 'government'
  | 'family'
  | 'other';

export type EvidenceType = 'document' | 'image' | 'payment' | 'message' | 'email' | 'other';

export interface User {
  id: string;
  name: string;
  email?: string;
  preferredLanguage: LanguageCode;
  state: string;
  district: string;
  createdAt: string;
}

export interface Case {
  id: string;
  userId?: string;
  title: string;
  category: CaseCategory;
  jurisdiction: string;
  description: string;
  facts: string[];
  riskLevel: RiskLevel;
  urgencyFlags: string[];
  status: 'intake' | 'questions' | 'analyzed' | 'action_plan' | 'resolved';
  analysis?: AnalysisResult;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  label: string;
  value: string;
  badge?: string; // e.g. "Strongest Proof", "Common", "Implied Contract"
}

export interface Question {
  id: string;
  caseId?: string;
  category?: CaseCategory;
  question: string;
  type: 'radio' | 'text' | 'select' | 'boolean';
  options?: QuestionOption[];
  answer?: string;
  required?: boolean;
  explanation?: string; // "Why are we asking this?"
  stepIndex?: number;
  totalSteps?: number;
}

export interface Evidence {
  id: string;
  caseId: string;
  type: EvidenceType;
  name: string;
  description?: string;
  verified: boolean;
  size?: string;
  fileUrl?: string;
  extractedMeta?: Record<string, any>;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  date: string;
  title: string;
  description: string;
  evidenceIds: string[];
}

export interface DocumentAnalysis {
  documentType: string;
  summary: string;
  parties: string[];
  dates: string[];
  amounts: string[];
  importantClauses: Array<{
    page?: number;
    section: string;
    summary: string;
    confidence: 'low' | 'medium' | 'high';
  }>;
  uncertainties: string[];
  pageReferences: number[];
}

export interface LegalDocument {
  id: string;
  caseId: string;
  name: string;
  type: string;
  extractedText?: string;
  analysis?: DocumentAnalysis;
  createdAt: string;
  deletedAt?: string | null;
}

export interface Source {
  id: string;
  title: string;
  organization: string;
  url: string;
  jurisdiction: string;
  topic: string;
  dateChecked: string;
  sourceType: 'official' | 'statute' | 'guideline' | 'tribunal';
  excerpt?: string;
}

export interface GeneratedDocument {
  id: string;
  caseId: string;
  type:
    | 'security_deposit_request'
    | 'consumer_complaint'
    | 'wage_payment_request'
    | 'general_grievance'
    | 'legal_aid_application'
    | 'evidence_timeline';
  title: string;
  content: string;
  verifiedFields: Record<string, string>;
  checklist: Array<{ label: string; verified: boolean }>;
  createdAt: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  service: string;
  description?: string;
}

export interface RiskAssessment {
  riskLevel: RiskLevel;
  flags: string[];
  requiresHumanHelp: boolean;
  emergencyContacts: EmergencyContact[];
}

export interface ActionPlanStep {
  step: number;
  title: string;
  description: string;
  userAction: string;
  evidenceNeeded: string[];
  source?: string;
  optionalEscalation?: string;
  deadlineNotice?: string;
  status: 'pending' | 'in_progress' | 'completed';
  verifiedByUser?: boolean;
}

export interface AnalysisResult {
  category: CaseCategory;
  possibleIssue: string;
  confidence: number;
  reasoningSummary: string;
  simpleExplanation: string;
  relevantConcepts: string[];
  limitations: string;
  missingInformation: string[];
  jurisdiction: string;
  riskLevel: RiskLevel;
  sources: Source[];
}

export interface LegalHelpResource {
  id: string;
  name: string;
  state: string;
  district: string;
  service: string;
  eligibility: string;
  phone: string;
  website: string;
  address: string;
  languages: string[];
  official: boolean;
  dateChecked: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
