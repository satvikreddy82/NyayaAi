import pdfParse from 'pdf-parse';
import { DocumentAnalysis, LanguageCode } from '../../../shared/types';
import { getAIProvider } from '../providers/geminiProvider';

export class DocumentAnalysisService {
  public async extractTextFromBuffer(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      try {
        const data = await pdfParse(buffer);
        return data.text || '';
      } catch (err: any) {
        console.warn('[DocAnalysis] pdf-parse error:', err.message);
        return buffer.toString('utf-8');
      }
    }
    // For txt or other text formats
    return buffer.toString('utf-8');
  }

  public async analyzeDocumentText(
    text: string,
    docType: string,
    language: LanguageCode = 'en'
  ): Promise<DocumentAnalysis> {
    const ai = getAIProvider();
    return await ai.analyzeDocument(text, docType, language);
  }
}

export const documentAnalysisService = new DocumentAnalysisService();
