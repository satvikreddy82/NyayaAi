import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { api } from '../services/api';
import { downloadLegalNoticePdf } from '../services/pdfGenerator';
import { GeneratedDocument } from '../../../shared/types';
import demoData from '../data/demoCase.json';

export const DocumentGeneratorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState<GeneratedDocument['type']>('security_deposit_request');
  const [docContent, setDocContent] = useState<string>('');
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Verification Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    name: true,
    address: true,
    date: true,
    amount: true,
    recipient: true,
    attachments: true,
    facts: true
  });

  // Fact fields — use placeholders for new cases, only populate from actual case data
  const [facts, setFacts] = useState<Record<string, string>>({
    'Your Name': 'Demo User',
    'Opposing Party': '[Other Party Name]',
    'Property / Subject Address': '[Address]',
    'Amount Claimed': '[Amount]',
    'Key Date': '[Date]',
    'Notice Cure Period': 'Reasonable time (deadline depends on applicable law — verify)'
  });

  useEffect(() => {
    if (id === 'case-demo-tn-8821' || !id) {
      setGeneratedDoc(demoData.generatedDocument as any);
      setDocContent(demoData.generatedDocument.content);
    } else {
      // Auto-generate for current case
      handleGenerate();
    }
  }, [id, selectedTemplate]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await api.generateDocument(
        id || 'case-demo-tn-8821',
        selectedTemplate,
        facts,
        language
      );
      setGeneratedDoc(result);
      setDocContent(result.content);
    } catch (err) {
      console.error(err);
      // Fallback to demo content
      setGeneratedDoc(demoData.generatedDocument as any);
      setDocContent(demoData.generatedDocument.content);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    // Check if user confirmed review checklist
    const allChecked = Object.values(checklist).every(Boolean);
    if (!allChecked) {
      setShowReviewModal(true);
      return;
    }

    if (generatedDoc) {
      downloadLegalNoticePdf({ ...generatedDoc, content: docContent }, id || 'NY-8821');
    }
  };

  const templates: { key: GeneratedDocument['type']; label: string; icon: string }[] = [
    { key: 'security_deposit_request', label: '1. Security Deposit Request Notice', icon: 'home' },
    { key: 'consumer_complaint', label: '2. Consumer Grievance Notice', icon: 'shopping_bag' },
    { key: 'wage_payment_request', label: '3. Unpaid Wages & Settlement Demand', icon: 'payments' },
    { key: 'general_grievance', label: '4. General Grievance Representation', icon: 'assignment' },
    { key: 'legal_aid_application', label: '5. NALSA / DLSA Legal Aid Application', icon: 'gavel' },
    { key: 'evidence_timeline', label: '6. Evidence Index & Timeline Dossier', icon: 'view_timeline' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-5 sm:p-6 rounded-xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">article</span>
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary">
              {t('draftNoticeStudio', 'Draft Notice Studio')}
            </h1>
          </div>
          <p className="text-xs text-outline mt-1 font-body">
            AI-generated editable draft notice. Always review all facts carefully before sending. This is not legal advice.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/action-plan/${id || 'case-demo-tn-8821'}`)}
            className="inline-flex items-center gap-1 bg-surface-container text-on-surface text-xs font-semibold px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Plan</span>
          </button>
        </div>
      </div>

      {/* Template Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {templates.map((tpl) => (
          <button
            key={tpl.key}
            onClick={() => setSelectedTemplate(tpl.key)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTemplate === tpl.key
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{tpl.icon}</span>
            <span>{tpl.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT CANVAS (8 cols): Document Paper Preview & Editor */}
        <section className="lg:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/60 pb-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                  AI-Assisted Pre-Litigation Draft
                </span>
                <h2 className="text-base font-bold text-on-surface font-headline">
                  {generatedDoc?.title || 'Notice Draft'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    isEditing
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-bright text-on-surface border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isEditing ? 'done' : 'edit'}
                  </span>
                  <span>{isEditing ? 'Finish Editing' : 'Edit in Studio'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-bright text-on-surface border border-outline-variant hover:bg-surface-container active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-on-primary hover:bg-primary-container active:scale-95 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Document Content Canvas (Paper Style) */}
            <div className="p-6 sm:p-8 bg-slate-50 border border-outline-variant/80 rounded-xl shadow-inner font-mono text-xs sm:text-sm">
              {isEditing ? (
                <textarea
                  rows={22}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full bg-white border border-primary/40 rounded-lg p-4 text-xs font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                />
              ) : (
                <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm space-y-4 font-sans text-on-surface">
                  {/* Watermark Notice */}
                  <div className="bg-amber-50 p-2 text-center rounded border border-amber-300 text-[10px] text-amber-900 font-bold tracking-wider">
                    AI-GENERATED DRAFT • REVIEW ALL FACTS CAREFULLY BEFORE SENDING • NOT LEGAL ADVICE
                  </div>

                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {docContent}
                  </pre>
                </div>
              )}
            </div>

            {/* Procedural Safeguard Disclaimer (Stitch spec lines 545-551) */}
            <div className="p-3.5 rounded-lg bg-surface border-l-4 border-primary border border-outline-variant flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-lg flex-shrink-0 mt-0.5">info</span>
              <p className="text-[11px] text-outline leading-relaxed">
                <strong>Procedural Safeguard:</strong> NyayaAI does not automatically send notices. You retain full control to verify, edit, print, or dispatch this demand through India Post Registered Post A.D. or your personal registered email.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN (4 cols): Interactive Facts Customizer & Pre-Flight Review Checklist */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Confirmed Facts Customizer */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
              <h3 className="text-xs font-bold text-primary font-headline uppercase tracking-wider">
                Confirmed Notice Details
              </h3>
              <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
                Live Sync
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {Object.entries(facts).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-[11px] font-semibold text-outline mb-0.5">{key}</label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const updated = { ...facts, [key]: e.target.value };
                      setFacts(updated);
                    }}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 text-xs text-on-surface outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-secondary text-on-secondary py-2.5 rounded-lg text-xs font-bold hover:bg-secondary/90 active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>{generating ? 'Regenerating Draft...' : 'Re-apply Details to Draft'}</span>
            </button>
          </div>

          {/* Pre-Flight Checklist */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-primary font-headline uppercase tracking-wider">
              Pre-Flight Review Checklist
            </h3>
            <p className="text-[11px] text-outline leading-tight">
              Before downloading or mailing, confirm each critical element below:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              {[
                { id: 'name', label: 'My name & contact details are correct' },
                { id: 'recipient', label: 'Recipient opposing party name & postal address are verified' },
                { id: 'amount', label: 'Claimed monetary amount matches transaction proofs' },
                { id: 'date', label: 'Dates (move-out / notice / payment) are confirmed' },
                { id: 'facts', label: 'No placeholders [LIKE THIS] remain in the text' }
              ].map((item) => (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist[item.id] ?? false}
                    onChange={(e) => setChecklist({ ...checklist, [item.id]: e.target.checked })}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-outline text-primary focus:ring-primary"
                  />
                  <span className="text-[11px] text-on-surface leading-tight font-medium">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Review Modal if Checklist not completed */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-600">
              <span className="material-symbols-outlined text-2xl">checklist</span>
              <h3 className="text-sm font-headline font-bold text-on-surface">
                Complete Pre-Flight Review Checklist
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To prevent inadvertent submission of incorrect details or unconfirmed placeholders, please tick all review points on the right sidebar before generating your formal PDF.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setChecklist({ name: true, address: true, date: true, amount: true, recipient: true, attachments: true, facts: true });
                  setShowReviewModal(false);
                  if (generatedDoc) {
                    downloadLegalNoticePdf({ ...generatedDoc, content: docContent }, id || 'NY-8821');
                  }
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
              >
                Confirm All & Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
