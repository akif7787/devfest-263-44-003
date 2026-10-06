export interface TenderInfo {
  tender_id: string;
  title: string;
  procuring_entity: string;
  bidder: string;
  submission_deadline: string; // YYYY-MM-DD
}

export interface RequirementItem {
  id: string;
  order: number;
  title_en: string;
  title_bn: string;
  mandatory: boolean;
  has_expiry: boolean;
}

export interface RequirementsData {
  tender: TenderInfo;
  requirements: RequirementItem[];
}

export interface UploadedFileRecord {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  hash: string; // SHA-256 for exact duplicate detection
  arrayBuffer?: ArrayBuffer;
  isDuplicateOf?: string; // name of file it duplicates
  duplicateIds: string[];
  matchedRequirementId?: string; // null or requirement id
  isCorruptOrEncrypted?: boolean;
  errorMessage?: string;
}

export type DocumentStatusType =
  | 'OK'
  | 'MISSING'
  | 'EXPIRY_NEEDED'
  | 'EXPIRED'
  | 'NOT_PROVIDED';

export interface RequirementMatchState {
  requirementId: string;
  matchedFileId?: string;
  expiryDate?: string; // YYYY-MM-DD
}

export interface RequirementEvaluation {
  requirement: RequirementItem;
  status: DocumentStatusType;
  isBlocking: boolean;
  matchedFile?: UploadedFileRecord;
  expiryDate?: string;
  statusReasonEn: string;
  statusReasonBn: string;
}

export interface ReadinessSummary {
  totalRequired: number;
  totalOptional: number;
  readyRequired: number;
  readyOptional: number;
  totalProblems: number;
  isReady: boolean;
  blockingReasonsEn: string[];
  blockingReasonsBn: string[];
}

export type Language = 'en' | 'bn';
