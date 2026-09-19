import { AIProvider } from './aiProvider';
import { AnalysisResult, ActionPlanStep, DocumentAnalysis, LanguageCode } from '../../../shared/types';
import legalSources from '../data/legalSources.json';

export class MockProvider implements AIProvider {
  public name = 'Mock AI (Demo Mode)';
  public isMock = true;

  public async classifyAndExplain(
    description: string,
    answers: Record<string, string>,
    retrievedSources: any[],
    language: LanguageCode
  ): Promise<AnalysisResult> {
    const textLower = (description + ' ' + JSON.stringify(answers)).toLowerCase();

    // Default to rental if mentions deposit, rent, flat, landlord
    let category: any = 'rental';
    let possibleIssue = 'Potential rental / security-deposit dispute';
    let reasoning = 'Based on the information provided, this situation appears to involve a security deposit that may not have been returned after the tenancy ended. This is an AI classification and not a legal finding.';
    let explanation = 'Your situation appears to involve a security deposit that has not been returned after the tenancy ended. The applicable rules may depend on the rental agreement, the location of the property, and the specific facts. Rules regarding security deposits vary by state and may also depend on whether your agreement was registered. This information is general and does not substitute for advice from a qualified legal professional.';
    let concepts = [
      'Security Deposit (Refundable Advance)',
      'Rental / Tenancy Agreement terms',
      'Applicable State Rent Legislation (varies by state)',
      'District Legal Services Authority (DLSA) — Free Legal Aid option',
      'NALSA Tele-Law Helpline (15100)'
    ];
    let limitations = 'Applicable rules may depend on the jurisdiction, the specific agreement, whether the agreement was registered, and the specific facts. This information is general and does not substitute for advice from a qualified legal professional.';
    let missing = ['Copy of signed tenancy agreement', 'Proof of key surrender / move-out communication'];
    let jurisdiction = answers['q-rental-1'] || 'Chennai District, Tamil Nadu';

    if (textLower.includes('salary') || textLower.includes('wage') || textLower.includes('employer') || textLower.includes('job')) {
      category = 'employment';
      possibleIssue = 'Potential non-payment of wages or full & final settlement dispute';
      reasoning = 'The situation appears to involve withholding of remuneration for services rendered. This is an AI classification and not a legal finding.';
      explanation = 'Your situation appears to involve delayed or unpaid wages following employment. The Payment of Wages Act, 1936 and the applicable state labour laws provide mechanisms for employees to seek wage recovery. Applicable procedures depend on your employment category and the specific facts.';
      concepts = ['Payment of Wages Act, 1936', 'Full & Final Settlement', 'Labour Commissioner Grievance', 'SAMADHAN Portal'];
      limitations = 'Remedies differ for managerial employees versus workmen covered by statutory wage ceilings. Verify applicable procedures with a qualified professional or labour authority.';
      missing = ['Appointment letter', 'Bank statement showing prior salary credits'];
      jurisdiction = 'District Labour Commissioner';
    } else if (textLower.includes('product') || textLower.includes('refund') || textLower.includes('order') || textLower.includes('flipkart') || textLower.includes('amazon')) {
      category = 'consumer';
      possibleIssue = 'Potential deficiency in service or consumer grievance';
      reasoning = 'The situation appears to involve receipt of defective goods or denial of a lawful refund. This is an AI classification and not a legal finding.';
      explanation = 'Your grievance appears to involve a consumer dispute regarding goods or services. The Consumer Protection Act, 2019 provides a framework for consumers to seek redress. The E-Daakhil digital portal allows online complaint filing. Applicable procedures depend on the specific facts and value of the claim.';
      concepts = ['Deficiency in Service', 'E-Daakhil Online Filing', 'National Consumer Helpline (1915)', 'Consumer Disputes Redressal Commission'];
      limitations = 'Consumer complaints must generally be filed within the statutory limitation period from the date of cause of action. Verify the applicable period with a qualified professional.';
      missing = ['Invoice / Tax Receipt', 'Customer support chat or ticket ID'];
      jurisdiction = 'District Consumer Disputes Redressal Commission';
    } else if (textLower.includes('scam') || textLower.includes('fraud') || textLower.includes('hacked') || textLower.includes('upi') || textLower.includes('otp')) {
      category = 'cybercrime';
      possibleIssue = 'Potential digital financial fraud or unauthorized transaction';
      reasoning = 'The situation appears to involve unauthorized debit or fraudulent inducement. This is an AI classification and not a legal finding.';
      explanation = 'This situation appears to involve digital financial fraud. Prompt reporting to Helpline 1930 enables authorities to attempt to block fraudulent transfers. Report to the National Cyber Crime Reporting Portal (cybercrime.gov.in). Prompt action is generally advisable.';
      concepts = ['Helpline 1930', 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', 'RBI Customer Liability Guidelines', 'IT Act, 2000'];
      limitations = 'Outcomes depend on the promptness of reporting and the specific circumstances of the fraud. Verify applicable protections with your bank and a qualified professional.';
      missing = ['Bank transaction UTR number', 'Screenshots of fraudulent communication'];
      jurisdiction = 'National Cyber Crime Portal';
    }

    // Multilingual localization for explanation if requested
    if (language === 'ta') {
      explanation = `வழங்கப்பட்ட விவரங்களின்படி, இது வீட்டு வாடகை முன்பணத்தை திரும்பப் பெறுவது தொடர்பான விஷயமாகத் தெரிகிறது. தமிழ்நாடு வாடகை முறைப்படுத்துதல் சட்டத்தின் கீழ் (TNRRRLT Act), காலி செய்த 30 நாட்களுக்குள் முறையான காரணமின்றி முன்பணத்தை பிடித்தம் செய்வது ஏற்றுக்கொள்ளப்படாது.`;
    } else if (language === 'hi') {
      explanation = `प्रदान किए गए विवरणों के अनुसार, यह मामला किराये की सुरक्षा जमा राशि (Security Deposit) की वापसी से जुड़ा प्रतीत होता है। भारतीय किरायेदारी कानून के तहत, परिसर खाली करने के बाद मकान मालिक बिना किसी वैध कारण या बिल के जमा राशि को अनिश्चित काल के लिए नहीं रोक सकता।`;
    } else if (language === 'te') {
      explanation = `అందించిన వివరాల ప్రకారం, ఇది అద్దె సెక్యూరిటీ డిపాజిట్ వాపసుకు సంబంధించిన సమస్యగా కనిపిస్తోంది. అద్దె నిబంధనల ప్రకారం, ఆస్తిని ఖాళీ చేసిన తర్వాత యజమాని సరైన రసీదులు లేకుండా డిపాజిట్‌ను అకారణంగా నిలిపివేయలేరు.`;
    }

    const matchedSources = (retrievedSources.length > 0 ? retrievedSources : legalSources).slice(0, 2);

    return {
      category,
      possibleIssue,
      confidence: 0.82,
      reasoningSummary: reasoning,
      simpleExplanation: explanation,
      relevantConcepts: concepts,
      limitations,
      missingInformation: missing,
      jurisdiction,
      riskLevel: 'low',
      sources: matchedSources as any
    };
  }

  public async generateActionPlan(
    caseDetails: any,
    analysis: AnalysisResult,
    language: LanguageCode
  ): Promise<ActionPlanStep[]> {
    if (analysis.category === 'rental') {
      return [
        {
          step: 1,
          title: 'Gather and Organize Your Documents',
          description: 'Collect the tenancy agreement, proof of deposit payment, and any written communication with your landlord.',
          userAction: 'Locate and safely store originals of your rental agreement and deposit payment proof.',
          evidenceNeeded: ['Rental agreement copy', 'Bank transfer record or receipt'],
          source: 'General best practice — document organization before any dispute',
          status: 'completed',
          verifiedByUser: false
        },
        {
          step: 2,
          title: 'Document the Move-Out',
          description: 'Gather any evidence of the property condition at move-out and key handover acknowledgement.',
          userAction: 'Organize move-out photos, written key handover acknowledgement, and message history.',
          evidenceNeeded: ['Move-out photos', 'Written key handover acknowledgement', 'Message history'],
          source: 'General best practice — evidence preservation',
          status: 'completed',
          verifiedByUser: false
        },
        {
          step: 3,
          title: 'Send a Formal Written Request for Refund',
          description: 'Send a polite but formal written request to the landlord asking for the deposit to be returned, stating the facts clearly. Keep a copy and use a method that provides delivery confirmation.',
          userAction: 'Draft and send a formal written request by registered post or email. Keep the postal receipt or email delivery confirmation.',
          evidenceNeeded: ['Postal receipt or email delivery confirmation'],
          source: 'General civil dispute best practice — formal written communication before escalation',
          status: 'in_progress',
          verifiedByUser: false
        },
        {
          step: 4,
          title: 'Consider Free Legal Aid — DLSA or NALSA',
          description: 'If the landlord does not respond, you may approach the District Legal Services Authority (DLSA) or call NALSA Tele-Law helpline (15100) for free legal assistance. Eligibility criteria apply.',
          userAction: 'Visit your local DLSA or call NALSA (15100) to understand your options and eligibility for free legal assistance.',
          evidenceNeeded: ['Copies of all your documents and correspondence'],
          source: 'Legal Services Authorities Act, 1987 — NALSA (https://nalsa.gov.in)',
          optionalEscalation: 'DLSA offers free pre-litigation conciliation. Availability and eligibility criteria apply — check the official NALSA website for current information.',
          status: 'pending',
          verifiedByUser: false
        },
        {
          step: 5,
          title: 'Seek Qualified Legal Advice',
          description: 'If the dispute remains unresolved, consider consulting a qualified advocate or approaching the appropriate civil court. The applicable forum and procedure depend on your specific jurisdiction and facts.',
          userAction: 'Consult a qualified advocate or legal aid clinic to understand the appropriate legal forum and procedure for your specific situation.',
          evidenceNeeded: ['All gathered documents and correspondence'],
          source: 'General civil dispute best practice — consult a qualified legal professional',
          optionalEscalation: 'Applicable court procedures vary by jurisdiction and amount. Verify with a qualified professional.',
          status: 'pending',
          verifiedByUser: false
        }
      ];
    }

    // Generic Action Plan
    return [
      {
        step: 1,
        title: 'Collect and Organize Primary Documentary Evidence',
        description: 'Gather all original bills, contracts, messages, and banking transactions relevant to your dispute.',
        userAction: 'Upload or mark as verified in the NyayaAI Evidence Vault.',
        evidenceNeeded: ['Primary contract / transaction receipt'],
        source: 'General best practice — evidence organization',
        status: 'completed',
        verifiedByUser: false
      },
      {
        step: 2,
        title: 'Issue Formal Written Notice of Grievance',
        description: 'Allow the other party a reasonable opportunity to resolve the grievance amicably. Send your request in writing with delivery confirmation.',
        userAction: 'Draft and dispatch the notice with delivery tracking proof (registered post or email with read receipt).',
        evidenceNeeded: ['Dispatch slip / email delivery confirmation'],
        source: 'General civil dispute best practice — written formal notice before escalation',
        status: 'in_progress',
        verifiedByUser: false
      },
      {
        step: 3,
        title: 'Seek Free Legal Assistance — DLSA or NALSA',
        description: 'If your written request is ignored, consider approaching the District Legal Services Authority (DLSA) or the NALSA Tele-Law helpline (15100) for free legal guidance.',
        userAction: 'Visit DLSA Helpdesk or dial NALSA 15100. Check official NALSA website (https://nalsa.gov.in) for eligibility and current contact details.',
        evidenceNeeded: ['Copy of notice', 'Unanswered reminders'],
        source: 'Legal Services Authorities Act, 1987 — NALSA (https://nalsa.gov.in)',
        optionalEscalation: 'Pre-litigation conciliation available at DLSA. Eligibility criteria apply.',
        status: 'pending',
        verifiedByUser: false
      }
    ];
  }

  public async analyzeDocument(
    text: string,
    docType: string,
    language: LanguageCode
  ): Promise<DocumentAnalysis> {
    const isRental = text.toLowerCase().includes('tenant') || text.toLowerCase().includes('rent') || text.toLowerCase().includes('landlord');
    
    if (isRental) {
      return {
        documentType: 'Residential Tenancy Agreement',
        summary: 'Agreement establishing an 11-month residential tenancy with monthly rent and a refundable security deposit.',
        parties: ['Landlord (Lessor)', 'Tenant (Lessee)'],
        dates: ['Execution Date: 15 Feb 2024', 'Tenancy Period: 11 Months', 'Notice Period: 30 Days'],
        amounts: ['Monthly Rent: ₹22,000/-', 'Refundable Security Deposit: ₹60,000/-'],
        importantClauses: [
          {
            page: 1,
            section: 'Clause 4 - Security Deposit',
            summary: 'Specifies deposit is fully refundable at the time of vacating subject to adjustment for electricity arrears or visible damages.',
            confidence: 'high'
          },
          {
            page: 2,
            section: 'Clause 7 - Notice of Vacating',
            summary: 'Requires either party to provide one calendar month advance written notice prior to terminating tenancy.',
            confidence: 'high'
          },
          {
            page: 2,
            section: 'Clause 11 - Normal Wear & Tear',
            summary: 'Excludes standard atmospheric wear and natural ageing from tenant painting liabilities.',
            confidence: 'medium'
          }
        ],
        uncertainties: [
          'Agreement is executed on non-judicial stamp paper but does not bear registration seal with the Rent Authority under TNRRRLT Act.',
          'Check whether meter reading was formally recorded in writing at move-out.'
        ],
        pageReferences: [1, 2]
      };
    }

    return {
      documentType: 'Commercial / Civil Record',
      summary: 'Extracted text contains terms, transaction records, and mutual obligations.',
      parties: ['First Party', 'Second Party'],
      dates: ['Referenced within document body'],
      amounts: ['Disputed amount indicated in transaction records'],
      importantClauses: [
        {
          page: 1,
          section: 'Core Obligation Clause',
          summary: 'Outlines the delivery of consideration and fulfillment terms.',
          confidence: 'medium'
        }
      ],
      uncertainties: ['Please review whether this document is fully executed and dated.'],
      pageReferences: [1]
    };
  }

  public async generateDocumentContent(
    templateType: string,
    facts: Record<string, string>,
    language: LanguageCode
  ): Promise<string> {
    const landlordName = facts['Landlord Name'] || facts['Opposing Party'] || '[Landlord / Opposing Party Name]';
    const tenantName = facts['Tenant Name'] || facts['Your Name'] || '[Your Full Name]';
    const address = facts['Property Address'] || facts['Address'] || '[Address of the Subject Property / Transaction]';
    const amount = facts['Deposit Amount'] || facts['Amount Claimed'] || '₹[Amount]';
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (templateType === 'security_deposit_request') {
      return `AI-GENERATED DRAFT — REVIEW BEFORE USE — NOT LEGAL ADVICE

Date: ${date}
Mode: Registered Post A.D. / Email

TO:
${landlordName}
${address}

FROM:
${tenantName}
[Your Current Residential Address]
Email: [Your Email ID] | Phone: [Your Mobile Number]

SUBJECT: REQUEST FOR REFUND OF SECURITY DEPOSIT — PROPERTY AT ${address}

Dear Sir / Madam,

I am writing with reference to the residential property at ${address} that I occupied as a tenant under a tenancy arrangement with you.

1. I vacated the property on [VACATING DATE] and handed over vacant possession of the keys to you.

2. At the commencement of the tenancy, I paid a refundable security deposit of ${amount}/- to you, which was duly received and held by you.

3. To date, the security deposit of ${amount}/- has not been returned, nor have I received any written explanation or itemized account for any deductions.

4. I request that you arrange for the return of the security deposit of ${amount}/- at the earliest. Please contact me to confirm the arrangements for return.

5. If this matter cannot be resolved amicably, I may need to consider approaching the appropriate authority or seeking legal assistance.

Account Details for Transfer:
Bank: [Bank Name] | A/c No: [Account Number] | IFSC: [IFSC Code]

Yours sincerely,

${tenantName}
Date: ${date}`;
    }

    return `AI-GENERATED DRAFT — REVIEW BEFORE USE — NOT LEGAL ADVICE

Date: ${date}

TO:
${landlordName}

FROM:
${tenantName}

SUBJECT: FORMAL REQUEST FOR RESOLUTION — AMOUNT OF ${amount}/-

Dear Sir / Madam,

I am writing regarding an unresolved dispute concerning ${address}.

1. An amount of ${amount}/- remains due, refundable, or unresolved between us.
2. Despite previous communications, this matter has not been resolved.
3. I request that you address and resolve this matter within a reasonable time.
4. If this matter cannot be resolved amicably, I may seek appropriate assistance, including free legal aid available through the National Legal Services Authority (NALSA — 15100).

Yours sincerely,

${tenantName}`;
  }
}
