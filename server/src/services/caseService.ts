import { Case, LanguageCode, AnalysisResult, ActionPlanStep } from '../../../shared/types';
import { db } from '../models/db';
import { v4 as uuidv4 } from 'uuid';
import { RiskDetectionService } from './riskDetectionService';
import { legalRetrievalService } from './legalRetrievalService';
import { getAIProvider } from '../providers/geminiProvider';
import demoData from '../data/demoCase.json';

export class CaseService {
  public async createCase(data: Partial<Case>): Promise<Case> {
    const id = `case-${uuidv4().slice(0, 8)}`;
    const risk = RiskDetectionService.evaluateRisk(data.description || '');

    const newCase: Case = {
      id,
      userId: data.userId || 'guest-user',
      title: data.title || `Case: ${data.category || 'General'} Issue`,
      category: data.category || 'other',
      jurisdiction: data.jurisdiction || 'India',
      description: data.description || '',
      facts: data.facts || [],
      riskLevel: risk.riskLevel,
      urgencyFlags: risk.flags,
      status: 'intake',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await db.saveCase(newCase);
  }

  public async getCases(): Promise<Case[]> {
    return await db.getCases();
  }

  public async getCaseById(id: string): Promise<Case | null> {
    if (id === 'case-demo-tn-8821') {
      return demoData.case as any;
    }
    return await db.getCaseById(id);
  }

  public async deleteCase(id: string): Promise<boolean> {
    return await db.deleteCase(id);
  }

  public async analyzeCase(
    caseId: string,
    answers: Record<string, string>,
    language: LanguageCode = 'en'
  ): Promise<AnalysisResult> {
    let caseItem = await this.getCaseById(caseId);
    if (!caseItem) {
      throw new Error(`Case not found: ${caseId}`);
    }

    const sources = legalRetrievalService.getSourcesByCategory(
      caseItem.category,
      caseItem.jurisdiction
    );
    const ai = getAIProvider();

    const analysis = await ai.classifyAndExplain(
      caseItem.description,
      answers,
      sources,
      language
    );

    caseItem.analysis = analysis;
    caseItem.category = analysis.category;
    caseItem.status = 'analyzed';
    await db.saveCase(caseItem);

    return analysis;
  }

  public async generateActionPlan(
    caseId: string,
    language: LanguageCode = 'en'
  ): Promise<ActionPlanStep[]> {
    if (caseId === 'case-demo-tn-8821') {
      return demoData.actionPlan as any;
    }

    const caseItem = await this.getCaseById(caseId);
    if (!caseItem || !caseItem.analysis) {
      throw new Error('Case must be analyzed before generating an action plan');
    }

    const ai = getAIProvider();
    const plan = await ai.generateActionPlan(caseItem, caseItem.analysis, language);

    caseItem.status = 'action_plan';
    await db.saveCase(caseItem);

    return plan;
  }

  public async loadDemoCase(): Promise<any> {
    // Populate demo records into db store if not already present
    await db.saveCase(demoData.case as any);
    for (const ev of demoData.evidence) {
      await db.saveEvidence(ev as any);
    }
    for (const tl of demoData.timeline) {
      await db.saveTimelineEvent(tl as any);
    }
    await db.saveGeneratedDocument(demoData.generatedDocument as any);

    return demoData;
  }
}

export const caseService = new CaseService();
