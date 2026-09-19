import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { UrgentSafetyBanner } from '../components/UrgentSafetyBanner';
import { api } from '../services/api';
import { ActionPlanStep, Case, Evidence } from '../../../shared/types';
import demoData from '../data/demoCase.json';

export const ActionPlanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [caseItem, setCaseItem] = useState<Case | null>(null);
  const [steps, setSteps] = useState<ActionPlanStep[]>([]);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'action_plan' | 'evidence' | 'documents' | 'help'>('action_plan');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (id === 'case-demo-tn-8821') {
          setCaseItem(demoData.case as any);
          setSteps(demoData.actionPlan as any);
          setEvidenceList(demoData.evidence as any);
        } else if (id) {
          const fetched = await api.getCaseById(id);
          setCaseItem(fetched);
          setEvidenceList(fetched.evidence || []);

          // Fetch action plan
          const plan = await api.getActionPlan(id, language);
          setSteps(plan);
        }
      } catch (err) {
        console.error('Action plan loading error:', err);
        // Fallback to demo plan
        setCaseItem(demoData.case as any);
        setSteps(demoData.actionPlan as any);
        setEvidenceList(demoData.evidence as any);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, language]);

  const toggleStepVerification = (stepNumber: number) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.step === stepNumber) {
          const nextStatus = s.status === 'completed' ? 'in_progress' : 'completed';
          return { ...s, status: nextStatus, verifiedByUser: nextStatus === 'completed' };
        }
        return s;
      })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-primary">
        <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* 1. URGENT SAFETY & RISK ESCALATION BANNER (from Stitch design) */}
      <UrgentSafetyBanner flags={caseItem?.urgencyFlags} />

      {/* 2. CASE HEADER & METADATA CARD */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-outline-variant/60 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-surface-container-high text-primary px-2.5 py-0.5 rounded-md">
                <span className="material-symbols-outlined text-xs">tag</span>
                <span>{caseItem?.id?.replace('case-', 'NY-') || 'NY-8821'}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-md">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>
                  verified
                </span>
                <span>Pre-Litigation Action</span>
              </span>
              <span className="text-xs text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                <span>Updated recently</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-tight pt-1">
              {caseItem?.title || 'Case: Security Deposit Recovery'}
            </h1>

            <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5 font-body">
              <span className="material-symbols-outlined text-outline text-base">location_on</span>
              <span>
                Jurisdiction: <strong>{caseItem?.jurisdiction || 'Not specified'}</strong>
              </span>
            </p>
          </div>

          {/* Quick Summary Metrics */}
          <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/70 self-start lg:self-auto">
            <div className="px-3 border-r border-outline-variant/80">
              <div className="text-[11px] text-outline font-medium">Evidence Attached</div>
              <div className="text-lg font-headline font-bold text-secondary flex items-center gap-1">
                <span>{evidenceList.filter((e) => e.verified).length} / {evidenceList.length || 0}</span>
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>
                  check_circle
                </span>
              </div>
            </div>
            <div className="px-2">
              <div className="text-[11px] text-outline font-medium">Steps</div>
              <div className="text-lg font-headline font-bold text-primary">{steps.length}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav aria-label="Case Sections" className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
          <button
            onClick={() => setActiveTab('action_plan')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold flex-shrink-0 transition-all ${
              activeTab === 'action_plan'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">route</span>
            <span>Action Plan ({steps.length})</span>
          </button>
          <button
            onClick={() => navigate(`/evidence/${id || 'case-demo-tn-8821'}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs font-semibold transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">folder_open</span>
            <span>Evidence Vault ({evidenceList.length || 4})</span>
          </button>
          <button
            onClick={() => navigate(`/generator/${id || 'case-demo-tn-8821'}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs font-semibold transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">description</span>
            <span>Draft Notice Studio</span>
          </button>
          <button
            onClick={() => navigate('/help')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs font-semibold transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>DLSA Legal Help</span>
          </button>
        </nav>
      </section>

      {/* ASYMMETRIC MAIN GRID (8 cols Left / 4 cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT WORKSPACE (8 Columns): Procedural Pathway & Quick Links */}
        <div className="lg:col-span-8 space-y-6">
          {/* 3. SUGGESTED ACTION PLAN TIMELINE */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-outline-variant/60">
              <div>
                <h2 className="text-base sm:text-lg font-headline font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">timeline</span>
                  <span>Suggested Procedural Pathway</span>
                </h2>
                <p className="text-xs text-outline mt-0.5">
                  Sequential dispute resolution pathway recommended under Indian tenancy & contract law.
                </p>
              </div>
              <span className="text-xs font-semibold bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full self-start sm:self-auto">
                Step 3 in Progress
              </span>
            </div>

            {/* Step By Step List */}
            <div className="relative pt-6 space-y-6">
              {/* Timeline Stem */}
              <div className="absolute left-4 top-8 bottom-6 w-0.5 bg-outline-variant hidden sm:block"></div>

              {steps.map((stepItem) => {
                const isCompleted = stepItem.status === 'completed';
                const isInProgress = stepItem.status === 'in_progress';

                return (
                  <div key={stepItem.step} className="relative flex items-start gap-4">
                    {/* Step Icon */}
                    <div
                      onClick={() => toggleStepVerification(stepItem.step)}
                      title="Click to toggle user verification status"
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs z-10 cursor-pointer transition-all ${
                        isCompleted
                          ? 'bg-secondary text-on-secondary'
                          : isInProgress
                          ? 'bg-primary text-on-primary ring-4 ring-primary-fixed'
                          : 'bg-surface-container border border-outline text-outline'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>
                          check
                        </span>
                      ) : (
                        <span className="text-xs font-bold">{stepItem.step}</span>
                      )}
                    </div>

                    {/* Step Content Card */}
                    <div
                      className={`flex-1 rounded-xl p-4 sm:p-5 transition-all ${
                        isInProgress
                          ? 'bg-surface-container-lowest border-2 border-primary-container shadow-sm'
                          : 'bg-surface-container-low border border-outline-variant/80'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {isInProgress && (
                            <span className="text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded">
                              CURRENT ACTION
                            </span>
                          )}
                          <h3 className="text-xs sm:text-sm font-bold text-on-surface font-headline">
                            Step {stepItem.step}: {stepItem.title}
                          </h3>
                        </div>

                        {stepItem.deadlineNotice ? (
                          <span className="text-[11px] font-semibold text-error flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            <span className="material-symbols-outlined text-xs">alarm</span>
                            {stepItem.deadlineNotice}
                          </span>
                        ) : isCompleted ? (
                          <span className="text-xs text-secondary flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            Verified
                          </span>
                        ) : (
                          <span className="text-xs text-outline">Upcoming Step</span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                        {stepItem.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-outline-variant/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-outline font-medium">Action:</span>
                          <span className="text-on-surface font-semibold">{stepItem.userAction}</span>
                        </div>

                        {stepItem.source && (
                          <span className="text-[11px] text-primary font-medium bg-surface-container px-2 py-0.5 rounded border border-outline-variant">
                            {stepItem.source}
                          </span>
                        )}
                      </div>

                      {/* Step 3 Active Action CTAs */}
                      {stepItem.step === 3 && (
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => navigate(`/generator/${id || 'case-demo-tn-8821'}`)}
                            className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary transition-all shadow-xs active:scale-95"
                          >
                            <span className="material-symbols-outlined text-base">edit_note</span>
                            <span>Generate Draft Request</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. EVIDENCE QUICK ACTION BAR */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-primary font-headline flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary">inventory_2</span>
                <span>Case Evidence Vault ({evidenceList.length} items logged)</span>
              </h3>
              <p className="text-xs text-on-surface-variant">
                Upload receipts, contracts, or chat exports to link with your legal notice.
              </p>
            </div>
            <button
              onClick={() => navigate(`/evidence/${id || 'case-demo-tn-8821'}`)}
              className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-xs shrink-0"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              <span>Open Evidence Vault</span>
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR (4 Columns): Official Help & Statutory Protections */}
        <aside className="lg:col-span-4 space-y-6">
          {/* 5. OFFICIAL LEGAL AID RESOURCE CARD (Stitch screen lines 556-598) */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
              <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded">
                Official Government Body • Free Legal Aid
              </span>
              <span className="material-symbols-outlined text-secondary">account_balance</span>
            </div>

            <div>
              <h3 className="text-base font-headline font-bold text-primary">
                Chennai District Legal Services Authority (DLSA)
              </h3>
              <p className="text-xs text-outline mt-1 leading-relaxed">
                Constitutional body constituted under the Legal Services Authorities Act, 1987 offering free pre-litigation mediation and pro-bono counsel.
              </p>
            </div>

            <div className="space-y-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/80 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-outline text-base flex-shrink-0 mt-0.5">pin_drop</span>
                <p className="text-on-surface">
                  City Civil Court Buildings, High Court Campus, Chennai – 600104
                </p>
              </div>
              <div className="flex items-start gap-2.5 border-t border-outline-variant/60 pt-2.5">
                <span className="material-symbols-outlined text-outline text-base flex-shrink-0 mt-0.5">phone_in_talk</span>
                <div>
                  <p className="font-bold text-on-surface">15100 <span className="text-outline font-normal">(NALSA Toll-Free 24/7)</span></p>
                  <p className="text-on-surface">044-25342441 <span className="text-outline font-normal">(Court Desk)</span></p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:15100"
                className="inline-flex items-center justify-center gap-1.5 bg-primary text-on-primary text-xs font-bold py-2.5 px-3 rounded-lg hover:bg-primary-container transition-all text-center"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>Call Helpdesk</span>
              </a>
              <a
                href="https://tnslsa.tn.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-surface-container border border-outline-variant text-on-surface text-xs font-bold py-2.5 px-3 rounded-lg hover:bg-surface-container-high transition-colors text-center"
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                <span>Portal</span>
              </a>
            </div>
          </section>

          {/* 6. LEGAL AID AWARENESS CARD */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm space-y-3" id="why-notice">
            <div className="flex items-center gap-2 text-primary font-bold text-xs font-headline">
              <span className="material-symbols-outlined">policy</span>
              <h3>About Security Deposit Disputes</h3>
            </div>
            <div className="text-xs text-on-surface-variant space-y-2 leading-relaxed">
              <p>
                If your landlord has not returned your security deposit, you may have options under the applicable state tenancy law or general contract principles.
              </p>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                  <span>Gather your tenancy agreement, deposit payment proof, and move-out evidence.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                  <span>Send a formal written request for refund with delivery confirmation.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                  <span>Free legal help is available through NALSA (15100) or your local DLSA. Eligibility criteria apply.</span>
                </li>
              </ul>
              <p className="text-[11px] text-outline italic">
                Applicable rules depend on the state, the specific agreement, and the facts. Verified source unavailable for specific deadlines — consult a qualified professional.
              </p>
            </div>
          </section>

          {/* 7. CITIZEN ADVISORY STANDARD */}
          <section className="bg-surface-container-low rounded-xl border border-outline-variant p-4">
            <div className="flex items-center gap-1.5 text-outline mb-1.5 text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>Citizen Advisory Standard</span>
            </div>
            <p className="text-[11px] text-outline leading-relaxed">
              NyayaAI provides legal information, not formal advocate representation. For ongoing court proceedings, always verify with an enrolled advocate or DLSA before taking irreversible procedural actions.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};
