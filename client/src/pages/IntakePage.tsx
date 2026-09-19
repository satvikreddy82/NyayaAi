import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { UrgencyAlertModal } from '../components/UrgencyAlertModal';
import { api } from '../services/api';
import { CaseCategory, RiskAssessment } from '../../../shared/types';

export const IntakePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const initialLocation = location.state || { state: '', district: '' };

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CaseCategory>('rental');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Risk detection state
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [showUrgencyModal, setShowUrgencyModal] = useState(false);

  const categories: { key: CaseCategory; label: string }[] = [
    { key: 'rental', label: t('rental', 'Rental & Housing') },
    { key: 'employment', label: t('employment', 'Employment & Wages') },
    { key: 'consumer', label: t('consumer', 'Consumer Grievance') },
    { key: 'cybercrime', label: t('cybercrime', 'Cybercrime & Fraud') },
    { key: 'financial', label: t('financial', 'Financial Dispute') },
    { key: 'other', label: t('other', 'Not sure / Help me classify') }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const doc = await api.uploadDocument(file, undefined, category);
      setAttachedFile(file.name);
      if (doc.extractedText) {
        setDescription((prev) => `${prev}\n\n[Extracted from ${file.name}]:\n${doc.extractedText?.slice(0, 500)}...`);
      }
    } catch (err: any) {
      alert(`File upload failed: ${err.message}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert('Please describe your legal situation.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. First run deterministic risk safety check BEFORE normal processing
      const risk = await api.checkRisk(description);
      setRiskAssessment(risk);

      if (risk.requiresHumanHelp) {
        setShowUrgencyModal(true);
      }

      // 2. Create the case
      const createdCase = await api.createCase({
        title: `${category.toUpperCase()}: ${description.slice(0, 50)}...`,
        category,
        jurisdiction: initialLocation.district && initialLocation.state
          ? `${initialLocation.district}, ${initialLocation.state}`
          : 'Jurisdiction not specified (please select state & district in questions)',
        description,
        facts: [description],
        riskLevel: risk.riskLevel,
        urgencyFlags: risk.flags
      });

      // Navigate to adaptive questions page
      navigate(`/questions/${createdCase.id}`, {
        state: { caseItem: createdCase }
      });
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Sub-Header Context Bar */}
      <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
          <span className="text-xs font-bold text-primary font-headline">
            {categories.find((c) => c.key === category)?.label}
          </span>
          <span className="text-xs text-outline hidden sm:inline">
            • Jurisdiction: {initialLocation.district}, {initialLocation.state}
          </span>
        </div>
        <span className="text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium">
          Step 2 of 4: Intake
        </span>
      </div>

      {/* Asymmetric 8:4 Grid Layout from Stitch Screen e97d18605b4a4d81a55084551e85db60 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Intake Stream & Multimodal Input Box (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* 1. Conversational Intake Header Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-xs font-semibold mb-2">
                  <span className="material-symbols-outlined text-xs">record_voice_over</span>
                  <span>Jan-Kalyan Legal Gate</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary tracking-tight">
                  {t('tellUsWhatHappened', 'Tell us what happened')}
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant font-body">
                  {t(
                    'explainNaturally',
                    "Explain naturally in your words. You don't need any legal terms, formal citations, or statutory sections."
                  )}
                </p>
              </div>
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-surface-container-low items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">gavel</span>
              </div>
            </div>

            {/* Privacy Shield Warning Card */}
            <div className="mt-4 p-3.5 bg-surface-container-low rounded-lg border border-outline-variant flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">verified_user</span>
              <div className="text-[11px] text-on-surface-variant space-y-0.5">
                <p className="font-semibold text-on-surface flex items-center gap-1">
                  <span>Privacy Shield</span>
                  <span className="text-secondary font-bold">• 256-bit Local Protection</span>
                </p>
                <p>Uploaded details remain confidential. You can redact private names or phone numbers before submission.</p>
              </div>
            </div>
          </div>

          {/* 2. Multimodal Input Box & Voice Transcriber */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label htmlFor="incident_details" className="text-xs font-bold text-primary font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">history_edu</span>
                <span>{t('incidentNarrative', 'Incident Narrative')}</span>
              </label>
              <span className="text-[11px] text-outline">
                {language === 'ta' ? 'Tamil / English auto-detection' : 'Multilingual voice & text'}
              </span>
            </div>

            {/* Input Textarea with Voice Support */}
            <div className="relative">
              <textarea
                id="incident_details"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t(
                  'describePlaceholder',
                  'Describe your situation here — e.g. "My landlord has not returned my security deposit after I moved out." Include the state and district where the issue occurred.'
                )}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3.5 text-xs sm:text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none transition-all resize-y placeholder:text-outline font-body"
              />
            </div>

            {/* Multimodal Toolbar & Voice Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-surface-container">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Voice Input Button */}
                <VoiceInputButton
                  onTranscript={(text) => setDescription((prev) => (prev ? `${prev} ${text}` : text))}
                />

                {/* File Upload Trigger */}
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-primary text-base">attach_file</span>
                  <span className="text-xs font-medium">
                    {uploadingFile ? 'Scanning File...' : attachedFile ? attachedFile : t('attachDocument', 'Add Agreement / Receipts')}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit Details Action Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                <span>{submitting ? 'Analyzing Safety & Facts...' : t('submitDetails', 'Submit Details')}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Category Pills Row */}
            <div className="pt-2">
              <p className="text-[11px] text-outline mb-2">
                {t('categorySuggestion', 'Category suggestion (tap to select or change):')}
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      category === c.key
                        ? 'bg-primary text-on-primary font-semibold shadow-xs'
                        : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Instant Preliminary Issue Analysis Preview (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 sm:p-6 shadow-sm flex flex-col gap-5 sticky top-20">
            {/* Card Header & Badge */}
            <div className="space-y-2 border-b border-surface-container pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5 font-headline">
                  <span className="material-symbols-outlined text-secondary text-base">analytics</span>
                  <span>{t('preliminaryAssessment', 'Preliminary Assessment')}</span>
                </span>
                <span className="text-[10px] bg-surface-container text-outline px-2 py-0.5 rounded font-mono">
                  Live Preview
                </span>
              </div>
              <h2 className="text-base font-bold text-on-surface font-headline leading-snug">
                {category === 'rental'
                  ? 'Rental / Security Deposit Withholding'
                  : `${category.toUpperCase()} Legal Context`}
              </h2>
              <div className="inline-block px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-tertiary text-[11px]">
                <span className="font-bold">{t('possibleIssue', 'Possible Issue')}</span> — Not a Final Legal Verdict
              </div>
            </div>

            {/* 3-Part Structured Blocks */}
            <div className="space-y-3">
              {/* Block 1: What We Understand */}
              <div className="p-3 rounded-lg bg-surface-bright border-l-4 border-primary border border-outline-variant">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary mb-1">
                  <span className="material-symbols-outlined text-sm">fact_check</span>
                  <span>{t('whatWeUnderstand', 'WHAT WE UNDERSTAND')}</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  {description.slice(0, 160)}...
                </p>
              </div>

              {/* Block 2: Evidence Needed */}
              <div className="p-3 rounded-lg bg-surface-bright border-l-4 border-amber-600 border border-outline-variant">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-on-tertiary-fixed-variant mb-1">
                  <span className="material-symbols-outlined text-sm">folder_shared</span>
                  <span>{t('evidenceWeStillNeed', 'WHAT EVIDENCE WE STILL NEED')}</span>
                </div>
                <ul className="text-xs text-on-surface space-y-0.5 list-disc list-inside">
                  <li>Signed agreement or digital transaction slip</li>
                  <li>Written communication & date of vacating</li>
                </ul>
              </div>

              {/* Block 3: Jurisdiction & Rules */}
              <div className="p-3 rounded-lg bg-surface-bright border-l-4 border-secondary border border-outline-variant">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-secondary mb-1">
                  <span className="material-symbols-outlined text-sm">account_balance</span>
                  <span>{t('jurisdictionAndRules', 'JURISDICTION & RULES')}</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  Governed under state tenancy / contract framework in {initialLocation.district}, {initialLocation.state}.
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-base">checklist_rtl</span>
              <span>Proceed to Adaptive Questions</span>
            </button>

            {/* Civic Disclaimer */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <p className="text-[11px] text-on-surface-variant leading-tight">
                <strong>Civic Advisory:</strong> NyayaAI provides verified statutory information and procedural templates under Indian law.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Emergency Alert Modal for High/Critical Risk Detection */}
      <UrgencyAlertModal
        assessment={riskAssessment}
        isOpen={showUrgencyModal}
        onClose={() => setShowUrgencyModal(false)}
      />
    </div>
  );
};
