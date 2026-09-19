import { GeneratedDocument, LanguageCode } from '../../../shared/types';
import { getAIProvider } from '../providers/geminiProvider';
import { v4 as uuidv4 } from 'uuid';

export class GeneratorService {
  public async generateDocument(
    caseId: string,
    templateType: GeneratedDocument['type'],
    facts: Record<string, string>,
    language: LanguageCode = 'en'
  ): Promise<GeneratedDocument> {
    const ai = getAIProvider();
    const content = await ai.generateDocumentContent(templateType, facts, language);

    const titleMap: Record<GeneratedDocument['type'], string> = {
      security_deposit_request: 'Formal Notice of Demand for Refund of Security Deposit',
      consumer_complaint: 'Notice of Consumer Grievance & Deficiency in Service',
      wage_payment_request: 'Formal Demand for Disbursement of Unpaid Wages & Settlement',
      general_grievance: 'Formal Legal Grievance & Statutory Representation',
      legal_aid_application: 'Application for Free Legal Aid & Pre-Litigation Mediation',
      evidence_timeline: 'Chronological Incident Timeline & Evidentiary Index'
    };

    const checklist = [
      { label: 'Full name and contact details of sender confirmed', verified: Boolean(facts['Your Name'] || facts['Tenant Name']) },
      { label: 'Recipient opposing party name and full postal address verified', verified: Boolean(facts['Opposing Party'] || facts['Landlord Name']) },
      { label: 'Exact financial amount claimed verified against bank/payment proof', verified: Boolean(facts['Amount Claimed'] || facts['Deposit Amount']) },
      { label: 'Relevant dates (transaction / move-out / notice) confirmed', verified: Boolean(facts['Date'] || facts['Vacated Date']) },
      { label: 'I understand this is an AI-generated draft — review before use', verified: false },
      { label: 'Attachments and documentary proofs to be listed by me', verified: false }
    ];

    return {
      id: `gendoc-${uuidv4().slice(0, 8)}`,
      caseId,
      type: templateType,
      title: titleMap[templateType] || 'Legal Notice Draft',
      content,
      verifiedFields: facts,
      checklist,
      createdAt: new Date().toISOString()
    };
  }
}

export const generatorService = new GeneratorService();
