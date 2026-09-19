import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { api } from '../services/api';
import { Case, Question } from '../../../shared/types';

export const QuestionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [caseItem, setCaseItem] = useState<Case | null>(location.state?.caseItem || null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadCaseAndQuestions = async () => {
      setLoading(true);
      try {
        let currentCase = caseItem;
        if (!currentCase) {
          currentCase = await api.getCaseById(id);
          setCaseItem(currentCase);
        }

        const res = await api.getQuestions(id, {});
        if (res.questions && res.questions.length > 0) {
          setQuestions(res.questions);
          // Set default option if available
          if (res.questions[0].options && res.questions[0].options.length > 0) {
            setSelectedAnswer(res.questions[0].options[0].value);
          }
        }
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCaseAndQuestions();
  }, [id]);

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  const handleNext = async () => {
    if (!currentQ || !id) return;

    const updatedAnswers = {
      ...answers,
      [currentQ.id]: selectedAnswer || 'Not specified'
    };
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      const nextQ = questions[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(nextQ.options?.[0]?.value || '');
    } else {
      // Completed all questions, trigger AI Issue Analysis
      setAnalyzing(true);
      try {
        const analysis = await api.analyzeCase(id, updatedAnswers, language);
        navigate(`/analysis/${id}`, {
          state: { analysis, caseItem }
        });
      } catch (err: any) {
        alert(`Analysis error: ${err.message}`);
        navigate(`/action-plan/${id}`);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-primary">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
          <span className="text-xs font-semibold">Loading adaptive legal questions...</span>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <span className="material-symbols-outlined text-3xl">psychology</span>
          </div>
          <h2 className="text-xl font-headline font-bold text-primary">
            Analyzing Case Context & Rules
          </h2>
          <p className="text-xs text-on-surface-variant font-body leading-relaxed">
            Synthesizing confirmed facts, matching approved statutory sources, and preparing your procedural action plan...
          </p>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Flow Context & Progress Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
          <span className="text-xs font-bold text-primary font-headline">
            {caseItem?.title || 'Case Intake'}
          </span>
          <span className="text-xs text-outline">
            | {t('step', 'Question')} {currentIndex + 1} of {questions.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full sm:w-48 bg-surface-container-high h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Adaptive Question Card (8 Cols) */}
        <section className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl border-2 border-primary-fixed p-5 sm:p-6 shadow-sm relative overflow-hidden space-y-5">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

            {/* Question Label Header */}
            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Adaptive Question {currentIndex + 1}</span>
              </span>
              <span className="text-xs text-outline font-medium">Statutory Verification Check</span>
            </div>

            {/* AI Prompt Bubble */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base">smart_toy</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-primary block">NyayaAI Legal Engine</span>
                <p className="text-sm sm:text-base text-on-surface font-semibold leading-relaxed">
                  {currentQ?.question}
                </p>
              </div>
            </div>

            {/* Options Input */}
            {currentQ?.options && currentQ.options.length > 0 ? (
              <fieldset className="space-y-2.5">
                <legend className="sr-only">Question Options</legend>
                {currentQ.options.map((opt) => {
                  const isChecked = selectedAnswer === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-between p-3.5 rounded-lg cursor-pointer transition-all ${
                        isChecked
                          ? 'border-2 border-primary bg-surface-container-lowest shadow-xs'
                          : 'border border-outline-variant bg-surface-bright hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`q-${currentQ.id}`}
                          value={opt.value}
                          checked={isChecked}
                          onChange={() => setSelectedAnswer(opt.value)}
                          className="w-4 h-4 text-primary border-outline focus:ring-primary"
                        />
                        <span className={`text-xs sm:text-sm text-on-surface ${isChecked ? 'font-bold' : 'font-medium'}`}>
                          {opt.label}
                        </span>
                      </div>
                      {opt.badge && (
                        <span className="text-[11px] text-secondary bg-secondary-container/40 px-2 py-0.5 rounded font-bold">
                          {opt.badge}
                        </span>
                      )}
                    </label>
                  );
                })}
              </fieldset>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Enter details here..."
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 text-xs sm:text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container outline-none"
                />
              </div>
            )}

            {/* Expandable "Why are we asking this?" Accordion */}
            {currentQ?.explanation && (
              <details className="group bg-surface-container rounded-lg p-3.5 border border-outline-variant text-on-surface">
                <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-primary select-none">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">info</span>
                    <span>{t('whyAreWeAskingThis', 'Why are we asking this?')}</span>
                  </span>
                  <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-2.5 pt-2.5 border-t border-outline-variant/50 text-xs text-on-surface-variant leading-relaxed">
                  {currentQ.explanation}
                </div>
              </details>
            )}

            {/* Action Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-semibold transition-colors"
              >
                {t('skipQuestion', 'Skip Question')}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold active:scale-95 transition-all shadow-xs"
              >
                <span>{currentIndex + 1 === questions.length ? 'Finalize & Analyze' : t('confirmAndNext', 'Confirm & Next')}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Case Overview (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 sm:p-6 shadow-sm space-y-4">
            <span className="text-xs font-bold text-primary font-headline flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-base">folder</span>
              <span>Case Dossier In Progress</span>
            </span>

            <div className="bg-surface-bright p-3.5 rounded-lg border border-outline-variant text-xs space-y-2">
              <div>
                <span className="text-outline block text-[11px]">Primary Statement:</span>
                <p className="text-on-surface font-medium leading-snug">
                  {caseItem?.description?.slice(0, 150)}...
                </p>
              </div>
              <div className="border-t border-outline-variant/60 pt-2 flex justify-between">
                <span className="text-outline">Jurisdiction:</span>
                <span className="font-semibold text-primary">{caseItem?.jurisdiction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Answers Logged:</span>
                <span className="font-semibold text-secondary">{Object.keys(answers).length} questions</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                <strong>Why Adaptive?</strong> Rather than asking generic forms with 20 questions, NyayaAI only asks questions relevant to your specific situation and jurisdiction.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
