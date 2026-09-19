import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { DisclaimerCard } from '../components/DisclaimerCard';
import { api } from '../services/api';

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(true);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleLaunchJudgeDemo = async () => {
    setLoadingDemo(true);
    try {
      await api.loadDemo();
      navigate('/action-plan/case-demo-tn-8821');
    } catch (err) {
      console.error(err);
      navigate('/action-plan/case-demo-tn-8821');
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleStartOnboarding = () => {
    navigate('/intake', {
      state: {
        state: selectedState,
        district: selectedDistrict,
        language
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Content & CTAs */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-surface-container-high text-primary px-3 py-1 rounded-full text-xs font-semibold border border-outline-variant">
          <span className="material-symbols-outlined text-[16px]">gavel</span>
          <span>Empowering Citizens with Indian Law</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight leading-tight">
          {t('heroTitle', "Legal help shouldn't begin with legal language.")}
        </h1>

        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-2xl font-body">
          {t(
            'heroSubtitle',
            'Describe your problem in your own words. NyayaAI helps you understand the issue, organize evidence, explore next steps, and find appropriate legal resources.'
          )}
        </p>

        {/* Action Button Group */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleStartOnboarding}
            className="flex items-center justify-center gap-2 bg-primary-container text-on-primary py-3.5 px-6 rounded-lg font-headline text-sm font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all"
          >
            <span>{t('startMyLegalJourney', 'Start My Legal Journey')}</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          <button
            onClick={handleLaunchJudgeDemo}
            disabled={loadingDemo}
            className="flex items-center justify-center gap-2 bg-secondary text-on-secondary py-3.5 px-6 rounded-lg font-headline text-sm font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">play_circle</span>
            <span>{loadingDemo ? 'Loading Demo Case...' : t('tryDemo', 'Try Demo (Judge Mode)')}</span>
          </button>

          <a
            href="#how-it-works"
            className="flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface py-3 px-5 rounded-lg text-sm font-medium hover:bg-surface-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-outline text-lg">help_outline</span>
            <span>{t('howItWorks', 'How It Works')}</span>
          </a>
        </div>
      </section>

      {/* 2. Hero Visual: Interactive Conversational Preview Card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-xs font-semibold text-on-surface-variant">
              {t('liveCivicDemo', 'Live Civic Law Demonstration')}
            </span>
          </div>
          <span className="text-xs bg-surface-container px-2.5 py-0.5 rounded text-primary font-medium">
            TN Tenancy & Deposit
          </span>
        </div>

        {/* User Message */}
        <div className="flex items-start gap-2.5 pl-4 justify-end">
          <div className="bg-surface-container-high text-primary rounded-2xl rounded-tr-xs p-3.5 max-w-[90%] shadow-xs">
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              "My landlord hasn't returned my security deposit of ₹60,000 for 3 months after vacating."
            </p>
            <span className="text-[10px] text-outline mt-1 block text-right">
              Voice / Text Intake • Chennai, TN
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-outline text-xs shrink-0 font-semibold">
            {t('you', 'You')}
          </div>
        </div>

        {/* NyayaAI Empathic Response Card */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-lg">gavel</span>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl rounded-tl-xs p-4 space-y-3 w-full shadow-xs">
            <div className="border-l-4 border-secondary pl-3">
              <span className="text-[11px] text-secondary font-bold uppercase tracking-wider block">
                {t('empatheticAssessment', 'Empathetic Assessment')}
              </span>
              <p className="text-xs sm:text-sm text-on-surface mt-0.5">
                Based on your description, this may involve a rental and security-deposit dispute under Tamil Nadu Tenancy provisions (TNRRRLT Act, 2017).
              </p>
            </div>

            {/* Structured Clause Checklist */}
            <div className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant space-y-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">check_circle</span>
                <p className="text-xs text-on-surface leading-tight">
                  <strong className="font-semibold">{t('possibleIssue', 'Possible Issue')}:</strong> Unjustified Security Deposit Retention (Over 30 days)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">fact_check</span>
                <p className="text-xs text-on-surface leading-tight">
                  <strong className="font-semibold">{t('clarificationsNeeded', 'Clarifications Needed')}:</strong> Rental agreement copy & move-out inspection confirmation
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">inventory_2</span>
                <p className="text-xs text-on-surface leading-tight">
                  <strong className="font-semibold">{t('evidenceChecklist', 'Evidence Checklist')}:</strong> Bank transfer slip, IMPS reference, WhatsApp chat exports
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">handshake</span>
                <p className="text-xs text-on-surface leading-tight">
                  <strong className="font-semibold">{t('actionPlan', 'Action Plan')}:</strong> 15-day statutory demand notice drafting & DLSA mediation
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-outline pt-1">
              <span className="flex items-center gap-1 text-secondary font-medium">
                <span className="material-symbols-outlined text-sm">verified</span>
                Sec. 13 TN Regulation of Rights (TNRRRLT Act)
              </span>
              <button
                onClick={handleLaunchJudgeDemo}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Inspect Complete Case Flow →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust Strip (2x2 Grid for Mobile Ergonomics) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3.5 flex items-center gap-2.5 shadow-xs">
          <span className="material-symbols-outlined text-primary-container text-2xl">psychology</span>
          <span className="text-xs text-on-surface font-semibold leading-tight">
            {t('trustAiAssisted', 'AI-assisted legal information')}
          </span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3.5 flex items-center gap-2.5 shadow-xs">
          <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
          <span className="text-xs text-on-surface font-semibold leading-tight">
            {t('trustOfficialSource', 'Official-source focused')}
          </span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3.5 flex items-center gap-2.5 shadow-xs">
          <span className="material-symbols-outlined text-primary text-2xl">translate</span>
          <span className="text-xs text-on-surface font-semibold leading-tight">
            {t('trustMultilingual', 'Multilingual (English, Tamil, Telugu, Hindi)')}
          </span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3.5 flex items-center gap-2.5 shadow-xs">
          <span className="material-symbols-outlined text-error text-2xl">support_agent</span>
          <span className="text-xs text-on-surface font-semibold leading-tight">
            {t('trustHumanEscalation', 'Human escalation for urgent cases')}
          </span>
        </div>
      </section>

      {/* 4. Critical Mandatory Legal Disclaimer Card */}
      <DisclaimerCard onAcknowledge={setDisclaimerAccepted} defaultChecked={disclaimerAccepted} />

      {/* 5. Fast Onboarding Step Drawer Preview */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 shadow-sm space-y-5" id="quick-onboarding">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-secondary font-bold tracking-wider uppercase">
              Express Assessment
            </span>
            <h2 className="text-lg sm:text-xl font-headline font-bold text-primary">
              {t('quickOnboarding', 'Quick Case Onboarding')}
            </h2>
          </div>
          <span className="text-xs bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant font-medium">
            {t('step', 'Step')} 1 {t('of', 'of')} 4
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-4 gap-1.5">
            <div className="h-1.5 rounded-full bg-primary-container"></div>
            <div className="h-1.5 rounded-full bg-surface-container-highest"></div>
            <div className="h-1.5 rounded-full bg-surface-container-highest"></div>
            <div className="h-1.5 rounded-full bg-surface-container-highest"></div>
          </div>
          <div className="flex justify-between text-[11px] text-on-surface-variant pt-1">
            <span className="text-primary font-bold">1. Location & Jurisdiction</span>
            <span className="text-outline">2. Problem Narrative</span>
            <span className="text-outline">3. Adaptive Questions</span>
            <span className="text-outline">4. Action Plan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-primary mb-1">Select State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Telangana">Telangana</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi NCT</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="All India">Other / Pan-India</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1">Select District</label>
            <input
              type="text"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              placeholder="e.g. Chennai, Bengaluru, Hyderabad"
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleStartOnboarding}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-5 rounded-lg text-xs font-bold shadow-xs hover:bg-primary-container active:scale-95 transition-all"
        >
          <span>Continue to Problem Intake</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </section>

      {/* 6. How It Works Section */}
      <section id="how-it-works" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-headline font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">alt_route</span>
          <span>How NyayaAI Works: 10-Step Ethical Legal Pipeline</span>
        </h3>
        <p className="text-xs text-on-surface-variant">
          Engineered to eliminate bureaucratic friction and intimidation while maintaining strict adherence to Indian legal facts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {[
            { step: '1', title: 'Problem Intake', desc: 'Type, speak (voice), or upload notice/agreement in your native language.' },
            { step: '2', title: 'Deterministic Urgency Filter', desc: 'Pre-AI safety scanner immediately detects harassment, violence, or court deadlines.' },
            { step: '3', title: 'Adaptive Questions', desc: 'Progressive inquiry asking only relevant questions (e.g. agreement status, receipts).' },
            { step: '4', title: 'Issue Classification', desc: 'Calculates non-definitive category, potential issue, and legal confidence score.' },
            { step: '5', title: 'Simple Explanation', desc: 'No legalese. Clear translation of applicable legal concepts and limitations.' },
            { step: '6', title: 'Verified Sources', desc: 'Cites official government databases (NALSA, TNRRRLT Act, eCourts). No hallucinated laws.' },
            { step: '7', title: 'Evidence Vault', desc: 'Timeline and checklist linking payments, messages, and agreements with user verification.' },
            { step: '8', title: 'Procedural Action Plan', desc: 'Sequential next steps distinguishing User Action, Evidence Needed, and Escalation.' },
            { step: '9', title: 'Document Generator', desc: 'Drafts demand notices with pre-flight checklist and watermarked PDF export.' },
            { step: '10', title: 'Legal Help Finder', desc: 'Locates District Legal Services Authorities (DLSA) and verified helpline desks.' }
          ].map((item) => (
            <div key={item.step} className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <h4 className="text-xs font-bold text-on-surface">{item.title}</h4>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
