import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { SourceCard } from '../components/SourceCard';
import { api } from '../services/api';
import { AnalysisResult, Case } from '../../../shared/types';

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(location.state?.analysis || null);
  const [caseItem, setCaseItem] = useState<Case | null>(location.state?.caseItem || null);
  const [loading, setLoading] = useState(!analysis);

  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  useEffect(() => {
    if (!analysis && id) {
      setLoading(true);
      api.getCaseById(id).then((data) => {
        setCaseItem(data);
        if (data.analysis) {
          setAnalysis(data.analysis);
        }
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id, analysis]);

  const handleAudioToggle = () => {
    if (isSpeaking) {
      stop();
    } else if (analysis?.simpleExplanation) {
      speak(analysis.simpleExplanation, language);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-primary">
        <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-sm text-outline">Analysis data not found for this case.</p>
        <button
          onClick={() => navigate('/intake')}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-semibold"
        >
          Start New Intake
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider block font-headline">
            Case Assessment Completed
          </span>
          <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary">
            {analysis.possibleIssue}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAudioToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-red-50 text-error border-error animate-pulse'
                : 'bg-surface-container text-primary border-outline-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isSpeaking ? 'stop' : 'volume_up'}
            </span>
            <span>{isSpeaking ? 'Stop Audio' : 'Listen to Explanation'}</span>
          </button>
          <span
            className="text-xs font-bold bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-md border border-outline-variant"
            title="AI Classification Confidence: This indicates how strongly the AI matched the information to a category. It does not indicate legal certainty."
          >
            AI Confidence: {Math.round(analysis.confidence * 100)}%
          </span>
        </div>
      </div>

      {/* AI vs Source Clarity Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
        <span className="material-symbols-outlined text-amber-600 text-base flex-shrink-0 mt-0.5">info</span>
        <div>
          <span className="font-bold">Understanding this page: </span>
          <span>AI Confidence ({Math.round(analysis.confidence * 100)}%) indicates how strongly the AI matched your description to a legal category. It does not indicate legal certainty or predict an outcome. Always verify with a qualified legal professional.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Explanation, Concepts, Limitations (8 Cols) */}
        <section className="lg:col-span-8 space-y-6">
          {/* 1. Simple Explanation Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-headline text-base font-bold border-b border-surface-container pb-2">
              <span className="material-symbols-outlined text-secondary">forum</span>
              <h2>AI Interpretation (Simple Explanation)</h2>
            </div>
            <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 text-blue-800 px-2 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-xs">smart_toy</span>
              <span className="font-semibold">AI INTERPRETATION</span>
              <span className="text-blue-600">— not a legal finding</span>
            </div>
            <p className="text-sm text-on-surface leading-relaxed font-body">
              {analysis.simpleExplanation}
            </p>
          </div>

          {/* 2. Relevant Legal Concepts */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-headline text-sm font-bold">
              <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
              <h3>Relevant Legal Concepts & Provisions</h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {analysis.relevantConcepts?.map((concept, idx) => (
                <span
                  key={idx}
                  className="bg-surface-container px-3 py-1.5 rounded-lg text-xs font-semibold text-primary border border-outline-variant"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Statutory Limitations & Scope */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-headline text-sm font-bold">
              <span className="material-symbols-outlined text-amber-600 text-lg">policy</span>
              <h3>Procedural Limitations & Evidentiary Scope</h3>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-body">
              {analysis.limitations}
            </p>
          </div>

          {/* CTA to Action Plan */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary-container text-on-primary p-5 rounded-xl shadow-xs">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold font-headline">Ready for Procedural Next Steps?</h4>
              <p className="text-xs opacity-90">
                Explore the structured 5-step action plan, evidence vault, and statutory notice drafter.
              </p>
            </div>
            <button
              onClick={() => navigate(`/action-plan/${id}`)}
              className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary hover:bg-surface-bright px-5 py-2.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0"
            >
              <span>View Action Plan</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: Verified Sources (4 Cols) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-primary font-headline uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-base">verified</span>
              <span>Verified Official Sources ({analysis.sources?.length || 0})</span>
            </h3>
          </div>

          <p className="text-[11px] text-outline leading-tight">
            Every legal reference is verified against official statutes, NALSA guidelines, or State Legal Services records.
          </p>

          <div className="space-y-3">
            {analysis.sources && analysis.sources.length > 0 ? (
              analysis.sources.map((src, i) => (
                <SourceCard key={i} source={src} />
              ))
            ) : (
              <SourceCard />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
