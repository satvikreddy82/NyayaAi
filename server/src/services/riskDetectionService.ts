import { RiskAssessment, RiskLevel, EmergencyContact } from '../../../shared/types';

interface RiskRule {
  level: RiskLevel;
  flag: string;
  keywords: RegExp[];
}

const RISK_RULES: RiskRule[] = [
  {
    level: 'critical',
    flag: 'Immediate Physical Danger or Life Threat',
    keywords: [
      /\b(kill|suicid|attack|stab|assault|beat|violenc|violent|bleed|murder|hit me|physical threat|weapon|gun|knife)\b/i,
      /\b(உயிருக்கு ஆபத்து|கொலை|தாக்குதல்)\b/i,
      /\b(जान का खतरा|हत्या|मारपीट|आत्महत्या)\b/i
    ]
  },
  {
    level: 'critical',
    flag: 'Domestic Violence & Gender-Based Harm',
    keywords: [
      /\b(domestic violence|husband beat|in-laws harass|dowry|sexual assault|rape|stalk|molest)\b/i,
      /\b(குடும்ப வன்முறை|வரதட்சணை கொடுமை)\b/i,
      /\b(घरेलू हिंसा|दहेज प्रताड़ना|छेड़छाड़)\b/i
    ]
  },
  {
    level: 'critical',
    flag: 'Arrest, Custody, or Police Detention',
    keywords: [
      /\b(arrest|police custody|remand|lockup|police station|non-bailable warrant|nbw|fir filed against me)\b/i,
      /\b(கைது|காவல் நிலையம்)\b/i,
      /\b(गिरफ्तारी|हिरासत|थाने में बैठाया)\b/i
    ]
  },
  {
    level: 'high',
    flag: 'Imminent Illegal Eviction or Demolition',
    keywords: [
      /\b(throw.*luggage|lock.*out|forceful eviction|evict.*tonight|bulldoze|demolition|cut electricity|cut water)\b/i,
      /\b(வெளியேற்ற|வீட்டை பூட்டி)\b/i,
      /\b(घर से बाहर फेंक|जबरन खाली|बुलडोजर)\b/i
    ]
  },
  {
    level: 'high',
    flag: 'Court Deadline or Bail Emergency (< 48 Hours)',
    keywords: [
      /\b(hearing tomorrow|hearing today|court deadline|urgent bail|limitation expir|summons for tomorrow)\b/i,
      /\b(நீதிமன்ற வாய்தா|ஜாமீன்)\b/i,
      /\b(कोर्ट में पेशी|जमानत अर्जी)\b/i
    ]
  },
  {
    level: 'high',
    flag: 'Child Safety or Abduction Threat',
    keywords: [
      /\b(child abuse|child custody|child missing|kidnap|minor safety|pocso)\b/i,
      /\b(குழந்தை பாதுகாப்பு)\b/i,
      /\b(बच्चे की सुरक्षा|अपहरण)\b/i
    ]
  },
  {
    level: 'medium',
    flag: 'Financial Fraud & Unauthorized Account Debit',
    keywords: [
      /\b(bank fraud|upi scam|account emptied|hacked bank|lost money|otp fraud|cyber fraud)\b/i,
      /\b(பணம் மோசடி)\b/i,
      /\b(बैंक धोखाधड़ी|ऑनलाइन ठगी)\b/i
    ]
  }
];

export class RiskDetectionService {
  public static evaluateRisk(userText: string): RiskAssessment {
    if (!userText || typeof userText !== 'string') {
      return {
        riskLevel: 'low',
        flags: [],
        requiresHumanHelp: false,
        emergencyContacts: []
      };
    }

    const flags: string[] = [];
    let detectedLevel: RiskLevel = 'low';

    for (const rule of RISK_RULES) {
      for (const pattern of rule.keywords) {
        if (pattern.test(userText)) {
          flags.push(rule.flag);
          if (rule.level === 'critical') {
            detectedLevel = 'critical';
          } else if (rule.level === 'high' && detectedLevel !== 'critical') {
            detectedLevel = 'high';
          } else if (rule.level === 'medium' && detectedLevel === 'low') {
            detectedLevel = 'medium';
          }
          break;
        }
      }
    }

    const requiresHumanHelp = detectedLevel === 'critical' || detectedLevel === 'high';

    // Build immediate verified emergency contacts
    const emergencyContacts: EmergencyContact[] = [];

    if (detectedLevel === 'critical' || detectedLevel === 'high') {
      emergencyContacts.push(
        {
          name: 'National Emergency Response (Police / Fire / Medical)',
          phone: '112',
          service: 'Immediate Police Assistance (24x7 Toll-Free)',
          description: 'Emergency response service available nationwide across India.'
        },
        {
          name: 'Women & Domestic Distress Helpline',
          phone: '181',
          service: 'Women Crisis Intervention & One-Stop Support',
          description: 'Government 24/7 helpline for domestic harassment and safety protection.'
        },
        {
          name: 'NALSA Tele-Law Free Legal Helpline',
          phone: '15100',
          service: 'National Legal Aid & Duty Counsel Assistance',
          description: 'Access government pro-bono lawyers and legal aid clinics directly.'
        }
      );
    }

    if (flags.some((f) => f.includes('Financial Fraud'))) {
      emergencyContacts.push({
        name: 'National Cyber Crime Financial Helpline',
        phone: '1930',
        service: 'Citizen Financial Fraud Reporting Desk (Golden Hour Freeze)',
        description: 'Immediate reporting to block fraudulent money transfers and lien accounts.'
      });
    }

    return {
      riskLevel: detectedLevel,
      flags: Array.from(new Set(flags)),
      requiresHumanHelp,
      emergencyContacts
    };
  }
}
