import { Case, RiskAssessment, AnalysisResult, ActionPlanStep, LegalDocument, GeneratedDocument, Source, LegalHelpResource, Evidence } from '../../../shared/types';

const API_BASE = '/api';

export const api = {
  // AI Status
  async getAIStatus(): Promise<{ success: boolean; provider: string; isMock: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/status`);
      return await res.json();
    } catch {
      return { success: true, provider: 'Mock AI (Demo Mode)', isMock: true };
    }
  },

  // Deterministic Risk Check
  async checkRisk(text: string): Promise<RiskAssessment> {
    const res = await fetch(`${API_BASE}/risk/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    return data.data;
  },

  // Demo Mode
  async loadDemo(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    return data.data;
  },

  // Case Lifecycle
  async createCase(caseData: Partial<Case>): Promise<Case> {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData)
    });
    const data = await res.json();
    return data.data;
  },

  async getCases(): Promise<Case[]> {
    const res = await fetch(`${API_BASE}/cases`);
    const data = await res.json();
    return data.data || [];
  },

  async getCaseById(id: string): Promise<Case & { evidence: Evidence[]; timeline: any[]; documents: LegalDocument[]; generatedDocuments: GeneratedDocument[] }> {
    const res = await fetch(`${API_BASE}/cases/${id}`);
    const data = await res.json();
    return data.data;
  },

  async deleteCase(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/cases/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Adaptive Questions
  async getQuestions(caseId: string, answers: Record<string, string> = {}) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    return await res.json();
  },

  // Analysis
  async analyzeCase(caseId: string, answers: Record<string, string>, language: string = 'en'): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/cases/${caseId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, language })
    });
    const data = await res.json();
    return data.data;
  },

  // Action Plan
  async getActionPlan(caseId: string, language: string = 'en'): Promise<ActionPlanStep[]> {
    const res = await fetch(`${API_BASE}/cases/${caseId}/action-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language })
    });
    const data = await res.json();
    return data.data;
  },

  // Documents
  async uploadDocument(file: File, caseId?: string, docType?: string): Promise<LegalDocument> {
    const formData = new FormData();
    formData.append('file', file);
    if (caseId) formData.append('caseId', caseId);
    if (docType) formData.append('docType', docType);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.data;
  },

  async analyzeDocument(docId: string, language: string = 'en') {
    const res = await fetch(`${API_BASE}/documents/${docId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language })
    });
    return await res.json();
  },

  async generateDocument(caseId: string, templateType: string, facts: Record<string, string>, language: string = 'en'): Promise<GeneratedDocument> {
    const res = await fetch(`${API_BASE}/documents/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, templateType, facts, language })
    });
    const data = await res.json();
    return data.data;
  },

  // Evidence
  async addEvidence(evidenceData: { caseId: string; type: string; name: string; description?: string; size?: string }): Promise<Evidence> {
    const res = await fetch(`${API_BASE}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evidenceData)
    });
    const data = await res.json();
    return data.data;
  },

  async verifyEvidence(id: string, verified: boolean): Promise<Evidence> {
    const res = await fetch(`${API_BASE}/evidence/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified })
    });
    const data = await res.json();
    return data.data;
  },

  // Legal Sources & Help
  async getLegalSources(category?: string, jurisdiction?: string): Promise<Source[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (jurisdiction) params.append('jurisdiction', jurisdiction);
    const res = await fetch(`${API_BASE}/legal-sources?${params.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  async getLegalHelp(state?: string, district?: string): Promise<LegalHelpResource[]> {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (district) params.append('district', district);
    const res = await fetch(`${API_BASE}/legal-help?${params.toString()}`);
    const data = await res.json();
    return data.data || [];
  }
};
