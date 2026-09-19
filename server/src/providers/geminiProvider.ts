import { AIProvider } from './aiProvider';
import { AnalysisResult, ActionPlanStep, DocumentAnalysis, LanguageCode } from '../../../shared/types';
import {
  getIssueClassifierPrompt,
  getActionPlanPrompt,
  getDocumentAnalysisPrompt,
  getDocumentGenerationPrompt
} from '../utils/prompts';
import { MockProvider } from './mockProvider';

export class GeminiProvider implements AIProvider {
  public name = 'Google Gemini (Free Tier)';
  public isMock = false;
  private apiKey: string;
  private mockFallback = new MockProvider();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async callGemini(prompt: string): Promise<string> {
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    let lastError: any = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048
            }
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API returned HTTP ${response.status}: ${errText}`);
        }

        const data: any = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch (err: any) {
        lastError = err;
        console.warn(`[GeminiProvider] Error with ${model}:`, err.message);
      }
    }

    throw lastError || new Error('Gemini API failed with all fallback models');
  }

  private getLanguageName(code: LanguageCode): string {
    const map: Record<LanguageCode, string> = {
      en: 'English',
      ta: 'Tamil',
      te: 'Telugu',
      hi: 'Hindi'
    };
    return map[code] || 'English';
  }

  public async classifyAndExplain(
    description: string,
    answers: Record<string, string>,
    retrievedSources: any[],
    language: LanguageCode
  ): Promise<AnalysisResult> {
    try {
      const sourcesStr = JSON.stringify(retrievedSources, null, 2);
      const prompt = getIssueClassifierPrompt(
        description,
        answers,
        sourcesStr,
        this.getLanguageName(language)
      );
      const raw = await this.callGemini(prompt);
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        ...parsed,
        sources: retrievedSources
      };
    } catch (err: any) {
      console.warn('[GeminiProvider] Error in classifyAndExplain, falling back to Mock:', err.message);
      return this.mockFallback.classifyAndExplain(description, answers, retrievedSources, language);
    }
  }

  public async generateActionPlan(
    caseDetails: any,
    analysis: AnalysisResult,
    language: LanguageCode
  ): Promise<ActionPlanStep[]> {
    try {
      const prompt = getActionPlanPrompt(caseDetails, analysis, this.getLanguageName(language));
      const raw = await this.callGemini(prompt);
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err: any) {
      console.warn('[GeminiProvider] Error in generateActionPlan, falling back to Mock:', err.message);
      return this.mockFallback.generateActionPlan(caseDetails, analysis, language);
    }
  }

  public async analyzeDocument(
    text: string,
    docType: string,
    language: LanguageCode
  ): Promise<DocumentAnalysis> {
    try {
      const prompt = getDocumentAnalysisPrompt(text, docType, this.getLanguageName(language));
      const raw = await this.callGemini(prompt);
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err: any) {
      console.warn('[GeminiProvider] Error in analyzeDocument, falling back to Mock:', err.message);
      return this.mockFallback.analyzeDocument(text, docType, language);
    }
  }

  public async generateDocumentContent(
    templateType: string,
    facts: Record<string, string>,
    language: LanguageCode
  ): Promise<string> {
    try {
      const prompt = getDocumentGenerationPrompt(templateType, facts, this.getLanguageName(language));
      return await this.callGemini(prompt);
    } catch (err: any) {
      console.warn('[GeminiProvider] Error in generateDocumentContent, falling back to Mock:', err.message);
      return this.mockFallback.generateDocumentContent(templateType, facts, language);
    }
  }
}

export function getAIProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const forceMock = process.env.MOCK_AI === 'true';

  if (!apiKey || forceMock) {
    if (!apiKey) {
      console.log('[AI Factory] GEMINI_API_KEY is not set. Using high-fidelity MockProvider (Demo Mode).');
    } else {
      console.log('[AI Factory] MOCK_AI=true is configured. Using MockProvider.');
    }
    return new MockProvider();
  }

  console.log('[AI Factory] Initializing Google Gemini AI Provider.');
  return new GeminiProvider(apiKey);
}
