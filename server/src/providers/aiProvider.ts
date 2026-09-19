import { AnalysisResult, ActionPlanStep, DocumentAnalysis, LanguageCode } from '../../../shared/types';

export interface AIProvider {
  name: string;
  isMock: boolean;

  classifyAndExplain(
    description: string,
    answers: Record<string, string>,
    retrievedSources: any[],
    language: LanguageCode
  ): Promise<AnalysisResult>;

  generateActionPlan(
    caseDetails: any,
    analysis: AnalysisResult,
    language: LanguageCode
  ): Promise<ActionPlanStep[]>;

  analyzeDocument(
    text: string,
    docType: string,
    language: LanguageCode
  ): Promise<DocumentAnalysis>;

  generateDocumentContent(
    templateType: string,
    facts: Record<string, string>,
    language: LanguageCode
  ): Promise<string>;
}
