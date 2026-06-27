export type DocumentType =
  | "rental_notice"
  | "tax_notice"
  | "termination_letter"
  | "court_summons"
  | "consumer_complaint"
  | "government_notice"
  | "unknown";

export type Language = "english" | "tamil" | "hindi";

export type FileType = "pdf" | "image" | "text";

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: FileType;
  rawText: string;
  storageUrl: string;
  createdAt: string;
}

export interface AgentResult {
  documentType: DocumentType;
  findings: string[];
  problematicClauses: string[];
  summary: string;
}

export interface GrokResult {
  relevantLaws: {
    name: string;
    section: string;
    description: string;
    url?: string;
  }[];
  recentJudgments: string[];
  legalSummary: string;
}

export interface MistralResult {
  whatThisMeans: string;
  yourRights: string[];
  nextSteps: string[];
  urgencyLevel: "low" | "medium" | "high";
}

export interface AnalysisResult {
  id: string;
  documentId: string;
  geminiResult: AgentResult;
  grokResult: GrokResult;
  mistralResult: MistralResult;
  finalSummary: string;
  language: Language;
  createdAt: string;
}